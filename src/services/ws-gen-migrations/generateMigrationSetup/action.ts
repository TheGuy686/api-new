import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { Command, DataTransformer, EAction, FileSave, GetOne, RenderTemplate } from '@eezze/decorators';
import { pascalCase } from '@eezze/libs/StringMethods';
import { EDatabase } from '@eezze/classes/logic';
import { LogicChain } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
	condition: (adm: ADM) => {
		if (adm.input.type === 'Mysql') return true;
		else return false;
	},
	exceptions: [
		{
			name: 'type-not-satisfied',
			condition:  (adm: ADM) => {
				return adm?.request?.hasExecExemption('condition-not-satisfied')
			}
		}
	]
})
export default class GenerateMigrationSetupAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('migRoot', `${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}/migration`);
			lc.stash.assign.text('prName', pascalCase(adm.result.name));

			await lc.result();
		}
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `mkdir -m 777 -p ${lc.stash.prop('migRoot')}/${lc.stash.prop('prName')}/src/entity/`;
		},
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `mkdir -m 777 -p ${lc.stash.prop('migRoot')}/${lc.stash.prop('prName')}/src/migration/`;
		},
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `cp ${process.env.BOILER_PLATE_ROOT}/migration/eezze/package.json ${lc.stash.prop('migRoot')}/${lc.stash.prop('prName')}`;
		},
	})
	@DataTransformer({
		output: async (adm: ADM, lc: LogicChain) => {
			const metadata = EJson.parseKeyObject(adm.action(0).result, 'metadata');
			const entities: any[] = [];

			let username = '', password = '';

			if (typeof metadata.credentials !== 'undefined') {
				const results = await EDatabase.GetOne(
					adm,
					'Mysql.CredentialsVaultRepo',
					['id'],
					1,
					(adm: ADM) => { return { id: metadata.credentials }}
				);

				const keyValues = EJson.parseKeyObject(results, 'keyValues');

				for (const keyValue of keyValues) {
					if (keyValue.key === metadata.user) 	username = keyValue.value;
					if (keyValue.key === metadata.password) password = keyValue.value;
				}

				adm.setResult({
					type: adm.action(0).result.type,
					host: metadata.host,
					port: metadata.port,
					databaseName: metadata.dbName,
					user: username,
					pass: password,
					secure: metadata.secureProtocol,
					server: metadata.localhost,
					rootPath: metadata.path,
					entities
				});
			}
			else {
				adm.setResult({
					type: adm.action(0).result.type,
					host: metadata?.host,
					port: metadata?.port,
					databaseName: metadata.dbName,
					user: username,
					pass: password,
					secure: metadata?.secureProtocol,
					server: metadata?.localhost,
					rootPath: metadata?.path,
					entities
				});
			}
		}
	})
	@RenderTemplate({
		template: 'migration-datasource',
		templateVars: (adm: ADM, lc: LogicChain) => adm.action(4).result,
	})
	// @todo: rename the old if any, before creating the new migration folder.
	// @FileSave({
	// 	datasource: 'FileStorageDefault',
	// 	previousFileName: (adm: ADM) => `${kebabCase(adm.input.previousName)}.ts`,
	// 	folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplRoot'),
	// 	fileName: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplName'),
	// 	content: (adm: ADM) => adm.result,
	// })
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => `projects/${adm.input.projectId}/migration/${lc.stash.prop('prName')}/src`,
		fileName: 'datasource.js',
		content: (adm: ADM) => adm.result,
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `npm --prefix ${lc.stash.prop('migRoot')}/${lc.stash.prop('prName')} install --omit=dev`;
		},
	})
	async _exec() {}
}
