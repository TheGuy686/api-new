import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';
import { LogicChain } from '@eezze/classes';
import { EDatabase } from '@eezze/classes/logic';
import { EAction, RenderTemplate, GetOne, DataTransformer, FileSave, Do, FileDelete } from '@eezze/decorators';
import { kebabCase, pascalCase, underscoreCase } from '@eezze/libs/StringMethods';

const servTypes: string[] = [
	'rest-service',
	'ws-service',
	'eezze-logger',
];

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class GenerateDatasourceCreateUpdateAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			try {
				lc.assign.text('type', kebabCase(adm.result.type));
				lc.stash.assign.text('name', kebabCase(adm.result.name));

				lc.stash.assign.text('type', adm.result.type);
				lc.stash.assign.text('prRoot', () => `projects/${adm.input.projectId}`);
				lc.stash.assign.text(
					'tplRoot',
					() => `${lc.stash.prop('prRoot')}/src/${servTypes.includes(lc.prop('type')) ? 'servers' : 'datasources'}`,
				);
				lc.stash.assign.text('tplName', `${kebabCase(adm.result.name)}.ts`);
				lc.stash.assign.text('tplPath', () => `${lc.stash.prop('tplRoot')}/${lc.stash.prop('tplName')}`);
				lc.stash.assign.object('metadata', EJson.parseKeyObject(adm.result, 'metadata'));

				await lc.result();
			}
			catch (err) {
				console.log('Error: ', err);
			}
		}
	})
	@GetOne({
		repo: 'Mysql.ConnectionRepo',
		checkOn: [ 'id' ],
		input: (adm: ADM, lc: LogicChain) => ({
			id: lc.stash.prop('metadata')?.connection,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			if (adm.result?.name) {
				lc.stash.assign.text('con', pascalCase(adm.result.name));
			}

			await lc.result();
		}
	})
	@FileDelete({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplPath'),
		fileName: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplName'),
		ext: 'ts',
	})
	@DataTransformer({
		output: async (adm: ADM, lc: LogicChain) => {
			const metadata = lc.stash.prop('metadata');

			let username = '', password = '';

			let logger,
				loggerMd,
				loggerProtocol,
				loggerHost,
				loggerPort,
				loggerPath,
				hasLogger = true

			if (typeof metadata.logger !== 'undefined') {
				const result: any = await EDatabase.GetOne(
					adm,
					'Mysql.DatasourceRepo',
					[ 'id' ],
					1,
					() => ({ id: metadata.logger })
				);

				logger = kebabCase(result?.name);
				loggerMd = EJson.parseKeyObject(result, 'metadata');

				loggerProtocol = 'http';
				loggerHost = loggerMd?.host;
				loggerPort = loggerMd?.port;
				loggerPath = loggerMd?.path;

				hasLogger = true;
			}

			if (typeof metadata.credentials !== 'undefined') {
				const results = await EDatabase.GetOne(
					adm,
					'Mysql.CredentialsVaultRepo',
					['id'],
					1,
					() => { return { id: metadata.credentials }}
				);

				const keyValues = EJson.parseKeyArray(results, 'keyValues');

				for (const keyValue of keyValues) {
					if (keyValue.key === metadata.user) 	username = keyValue.value;
					if (keyValue.key === metadata.password) password = keyValue.value;
				}

				adm.setResult({
					connection: lc.stash.prop('con', true),
					name: lc.stash.prop('name'),
					logger,
					type: kebabCase(lc.stash.prop('type')),
					host: metadata.host,
					port: metadata.port,
					path: metadata.path,
					databaseName: metadata.dbName,
					userKey: metadata.user,
					passKey: metadata.password,
					user: username,
					pass: password,
					secure: !!metadata?.secure,
					secureProtocol: metadata?.secureProtocol,
					protocol: metadata?.protocol,
					localhost: metadata.localhost,
					rootPath: metadata.rootPath,
					hasLogger,
					loggerProtocol,
					loggerHost,
					loggerPort,
					loggerPath,
					connectionId: metadata?.connectionId ? [ metadata?.connectionId ] : undefined,
					healthCheckPort: metadata?.healthCheckPort,
				});
			}
			else {
				adm.setResult({
					connection: lc.stash.prop('con', true),
					name: lc.stash.prop('name'),
					logger,
					type: kebabCase(lc.stash.prop('type')),
					host: metadata?.host,
					port: metadata?.port,
					path: metadata.path,
					databaseName: metadata.dbName,
					userKey: metadata.user,
					passKey: metadata.password,
					user: username,
					pass: password,
					secure: !!metadata?.secure,
					secureProtocol: metadata?.secureProtocol,
					protocol: metadata?.protocol,
					localhost: metadata?.localhost,
					rootPath: metadata?.rootPath,
					hasLogger,
					loggerProtocol,
					loggerHost,
					loggerPort,
					loggerPath,
					connectionId: metadata?.connectionId,
					healthCheckPort: metadata?.healthCheckPort,
				});
			}
		},
	})
	@RenderTemplate({
		prettify: true,
		template: (adm: ADM, lc: LogicChain) => servTypes.includes(lc.stash.prop('type')) ? 'servers' : 'datasource',
		templateVars: (adm: ADM) => adm.result,
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		previousFileName: (adm: ADM) => `${kebabCase(adm.input.previousName)}.ts`,
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplRoot'),
		fileName: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplName'),
		content: (adm: ADM) => adm.result,
	})
	@RenderTemplate({
		prettify: true,
		template: 'app',
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => !servTypes.includes(lc.stash.prop('type')),
				message: 'There is no need to generate the app.ts',
			}
		],
		templateVars: (adm: ADM, lc: LogicChain) => ({
			name: lc.stash.prop('name')
		}),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.lastActionWasSkipped,
				message: 'Skipped the file save of datasources->app.ts',
			}
		],
		folder: (adm: ADM, lc: LogicChain) => `${lc.stash.prop('prRoot')}/src/apps`,
		fileName: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplName'),
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
