import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { DataTransformer, EAction, FileSave, GetOne, RenderTemplate } from '@eezze/decorators';
import { EDatabase } from '@eezze/classes/logic';
import { LogicChain } from '@eezze/classes';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo'
})
export default class GenerateDatasourceCreateAction extends BaseAction {
	@GetOne({ checkOn: ['id'] })
	@DataTransformer({
		output: async (adm: ADM) => {
			const metadata = JSON.parse(adm.action(0).result.metadata);
			let username = '', password = '';

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
					path: metadata.path,
					rootPath: metadata?.rootPath,
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
					path: metadata?.path,
					rootPath: metadata?.rootPath,
				});
			}
		}
	})
	@RenderTemplate({
		template: 'datasource',
		templateVars: (adm: ADM) => adm.result,
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			return `${process.env.PROJECT_FILE_PATH}/projects/${adm.action(0).result.projectId}/src/datasources`
		},
		fileName: (adm: ADM, lc: LogicChain) => `controller.${kebabCase(adm.action(0).result.type)}-${kebabCase(adm.action(0).result.name)}.ts`,
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
