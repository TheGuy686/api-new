import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { EAction, GetOne, RenderTemplate, DataTransformer, FileSave } from '@eezze/decorators';
import { EDatabase } from '@eezze/classes/logic';
import { pascalCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
	condition: (adm: ADM) => {
		if (adm.input.type === "Mysql") return true;
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
export default class GenerateMigrationUpdateAction extends BaseAction {
	@GetOne({
		checkOn: ['id']
	})
	@DataTransformer({
		output: async (adm: ADM) => {
			const metadata = JSON.parse(adm.action(0).result.metadata);
			const entities: any[] = [];
			let username = '', password = '';

			if (adm?.input.entities) {
				const entitiesParsed = JSON.parse(adm?.input.entities);
				const entityKeys = Object.keys(entitiesParsed);

				for (const key of entityKeys) {
					if (entitiesParsed[key].length > 0) entities.push(key);
				}
			}

			if (typeof metadata.credentials !== 'undefined') {
				const results = await EDatabase.GetOne(
					adm,
					'Mysql.CredentialsVaultRepo',
					['id'],
					1,
					(adm: ADM) => { return { id: metadata.credentials }}
				)
				const keyValues = JSON.parse(results.keyValues);

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
		templateVars: (adm: ADM) => adm.result,
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM) => `projects/${ adm.input.projectId }/migration/${pascalCase(adm.action(0).result.name)}/src`,
		fileName: 'datasource.js',
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
