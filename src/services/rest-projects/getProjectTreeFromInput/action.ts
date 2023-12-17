import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';
import { Do, EAction } from '@eezze/decorators';
import { LogicChain } from '@eezze/classes';
import { kebabCase, pascalCase, underscoreCase } from '@eezze/libs/StringMethods';

import ProjectModel from 'models/project-model';
import RoleModel from 'models/role-model';
import VaultModel from 'models/credentials-vault-model';
import ValueStoreModel from 'models/value-store-model';
import ConnectionModel from 'models/connection-model';
import DatasourceModel from 'models/datasource-model';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Project'
})
export default class GetProjectTreeFromInputAction extends BaseAction {
	// first get the project object
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('project', new ProjectModel({
				projectName: adm.input.projectName,
				details: adm.input.description,
				handle: kebabCase(adm.input.projectName),
				industry: 'other',
				hasLogger: true
			}));

			await lc.result();
		}
	})
	// process the roles
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.list('roles', async (): Promise<any> => {
				const roles = (adm.input.roles ?? '').split('\n');
				const out = [];

				for (let r of roles) {
					if (!r) continue;

					const matches = r.match(/([a-zA-Z0-9_-]+)\s*?-\s?\s*(.*)/);

					if (!matches) continue;

					out.push(
						await new RoleModel({
							role: matches[1].trim().toUpperCase(),
							description: matches[2].trim(),
						}).serialize(true, true, adm)
					);
				}

				return out;
			});

			await lc.result();
		},
	})
	// process the vault
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			const vals = EJson.parseKeyArray(adm.input, 'vaultVals');

			if (adm.input?.sshKey) {
				vals.push({
					key: 'DEFAULT_CON_SSH_KEY',
					value: adm.input?.sshKey,
					isSecret: true,
				});
			}

			if (adm.input?.user) {
				vals.push({
					key: 'DEFAULT_CON_USER',
					value: adm.input?.user
				});
			}

			if (adm.input?.pass) {
				vals.push({
					key: 'DEFAULT_CON_PASS',
					value: adm.input?.pass,
					isSecret: true,
				});
			}

			const dsMetadata = EJson.parseKeyObject(adm.input, 'dsMetadata');

			if (Object.keys(dsMetadata).length > 0) {
				if (dsMetadata?.props?.user) {
					vals.push({
						key: 'DEFAULT_DB_USER',
						value: dsMetadata.props.user,
					});
				}

				if (dsMetadata?.props?.password) {
					vals.push({
						key: 'DEFAULT_DB_PASS',
						value: dsMetadata.props.password,
						isSecret: true,
					});
				}
			}

			let vault: any = await new VaultModel({
				name: 'Default Vault',
				description: 'This is the default valut that is deployed with this scaffold project',
				keyValues: vals,
			}).serialize(false, false, adm);

			vault.keyValues = EJson.parseKeyObject(vault, 'keyValues');

			lc.stash.assign.object('vault', vault);

			await lc.result();
		},
	})
	// process the values (These are basically what will be converted into the .env.json file)
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.list('values', async (): Promise<any> => {
				const values = EJson.parseKeyArray(adm.input, 'envVals');
				const out = [];

				for (let v of values) {
					out.push(
						await new ValueStoreModel(v).serialize(true, true, adm)
					);
				}

				return out;
			});

			await lc.result();
		},
	})
	// process the connection that will be created as given type
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			let auth: any = { props:{} };

			auth['type'] = 'rsa';

			if (adm.input?.user) {
				auth.props['user'] = 'DEFAULT_CON_USER';
			}

			if (adm.input?.pass) {
				auth.props['password'] = 'DEFAULT_CON_PASS';
			}

			if (adm.input?.sshKey) {
				auth.props['key'] = 'DEFAULT_CON_SSH_KEY';
			}

			lc.stash.assign.object('con', new ConnectionModel({
				name: 'Default Connection',
				description: 'This is the default setup from the create project scaffold. This server will be the main server that will run the various types of datasources and dependancies',
				type: adm.input?.type == 'eezze-hosted' ? 'server' : adm.input?.type,
				enabled: true,
				state: 'state',
				metadata: {
					auth,
					localhost: '0.0.0.0',
					host: adm.input.host,
					serviceTypes: [
						'rest',
						'websocket',
						'cron-task',
						'installable-services',
					],
				}
			}));

			await lc.result();
		},
	})
	// then process the datasources
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			const datasources: any = {
				restDs: await new DatasourceModel({
					key: `${pascalCase(adm.input?.projectName)}RestServer`,
					type: 'rest-service',
					name: `${adm.input?.projectName} Rest Server`,
					description: 'This is the default setup from the create project scaffold. This server will host all of the REST endpoints and services',
					metadata: {
						host: adm.input.host,
						port: 1100,
						secureProtocol: 'https',
						protocol: 'http',
						path: '/v1',
						secure: true,
						devIsSecure: false,
						storeState: false,
						healthCheckPort: 64000,
					},
				}).serialize(true, true, adm),
				wsDs: await new DatasourceModel({
					key: `${pascalCase(adm.input?.projectName)}WebsocketServer`,
					type: 'ws-service',
					name: `${adm.input?.projectName} Websocket Server`,
					description: 'This is the default setup from the create project scaffold. This server will host all of the WS services',
					metadata: {
						port: 1300,
						secureProtocol: 'wss',
						protocol: 'ws',
						host: adm.input.host,
						path: '/v1',
						secure: true,
						devIsSecure: false,
						storeState: true,
						storeInterval: 5000,
						healthCheckPort: 64001,
					},
				}).serialize(true, true, adm),
				loggerDs: await new DatasourceModel({
					key: `${pascalCase(adm.input?.projectName)}EezzeService`,
					type: 'eezze-logger',
					name: `${adm.input?.projectName} Eezze Service`,
					description: 'This is the default setup from the create project scaffold. This server will route all of the logs / services to be viewed in the dev pannel on the right hand side of the website',
					metadata: {
						host: adm.input.host,
						port: 1200,
						protocol: 'ws',
						secureProtocol: 'wss',
						path: '/v1',
						storeState: false,
						secure: true,
						devIsSecure: false,
						healthCheckPort: 64002,
					},
				}).serialize(true, true, adm),
			};

			datasources['restDs'].metadata = EJson.parseKeyObject(datasources['restDs'], 'metadata');
			datasources['wsDs'].metadata = EJson.parseKeyObject(datasources['wsDs'], 'metadata');
			datasources['loggerDs'].metadata = EJson.parseKeyObject(datasources['loggerDs'], 'metadata');

			const dsMetadata = EJson.parseKeyObject(adm.input, 'dsMetadata');

			if (Object.keys(dsMetadata).length > 0) {
				datasources['mysqlDs'] = await new DatasourceModel({
					key: `${pascalCase(adm.input?.projectName)}DefaultMySqlConnection`,
					type: 'Mysql',
					name: `${adm.input?.projectName} MySql Datasource`,
					description: 'This is the default setup from the create project scaffold. This is the default MySql type datasource',
					metadata:{
						host: adm.input.host,
						port: 3306,
						credentials: -1,
						dbName: underscoreCase(adm.input.projectName.toLowerCase()),
						user: 'DEFAULT_DB_USER',
						password: 'DEFAULT_DB_PASS',
					},
				}).serialize(true, true, adm);

				datasources['mysqlDs'].metadata = EJson.parseKeyObject(datasources['mysqlDs'], 'metadata');
			}

			lc.stash.assign.object('datasources', datasources);

			return await lc.result();
		},
	})
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			let con = await lc.stash.prop('con').serialize(false, false, adm);

			con.metadata = EJson.parseKeyObject(con, 'metadata');

			adm.setResult({
				info: await lc.stash.prop('project').serialize(false, false, adm),
				connection: con,
				datasources: lc.stash.prop('datasources'),
				roles: lc.stash.prop('roles'),
				vault: lc.stash.prop('vault'),
				values: lc.stash.prop('values'),
			});
		},
	})
	async _exec() {}
}
