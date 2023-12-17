import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';

import { LogicChain } from '@eezze/classes';
import { Command, DataTransformer, Do, EAction, FileSave, GetList, GetOne, Query, RenderTemplate, Success } from '@eezze/decorators';
import { kebabCase, pascalCase, filterString, jsonToYaml, generateRandomString } from '@eezze/libs/StringMethods';
import { ESet } from '@eezze/classes/logic';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ConnectionRepo',
})
export default class GenerateAnsibleCreateAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		input: (adm: ADM, lc: LogicChain) => {
			return {
				id: adm.input.connectionId
			}
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('connection', adm.result);

			await lc.result();
		}
	})
	@GetOne({
		repo: 'Mysql.ProjectRepo',
		checkOn: ['id'],
		input: (adm: ADM, lc: LogicChain) => {
			return {
				id: adm.input.projectId
			}
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('project', adm.result);
			lc.stash.assign.text('projectRoot', `${process.env.PROJECTS_FILE_ROOT}/projects/${ adm.result.id }`);
			lc.stash.assign.number('projectId', adm.result.id);
			lc.stash.assign.text('projectName', adm.result.projectName);

			await lc.result();
		}
	})
	@GetList({
		repo: 'Mysql.ServiceRepo',
		checkOn: ['projectId'],
		input: (adm: ADM) => ({ projectId: adm.input.projectId }),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('services', adm.result);

			await lc.result();
		},
	})
	@DataTransformer({
		output: (adm: ADM) => {
			try {
				const result: any = {
					connection: adm.stash.connection,
					datasources: [],
					credentials: [],
					environmentVariables: []
				};

				const services = adm.stash.services;

				for (const ser of services) {
					const def = EJson.parseKeyObject(ser, 'definition');
					const logic = JSON.parse(ser.logic);

					for (const ai of logic) {
						const ds = ai?.schema?.datasource;

						if (ds && !result.datasources.includes(ds)) {
							result.datasources.push(ds);
						}
					}
				}

				ESet(adm.stash, 'deps', result);

				return result;
			}
			catch (err) {
				ESet(adm.stash, 'deps', {});
				return {};
			}
		}
	})
	@GetList({
		repo: 'Mysql.DatasourceRepo',
		checkOn: ['projectId','active'],
		input: (adm: ADM) => ({ projectId: adm.input.projectId, active: 1 }),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const dss: any = [];
			const creds: any[] = [];

			for (const ds of adm.result) {
				const md = EJson.parseKeyObject(ds, 'metadata');

				// only store datasources from this connection. md.connect is the same as connectionId.
				if (typeof md?.connection != 'undefined' && connection.id === md?.connection) {
					dss.push(ds);
				}
			}

			ESet(adm.stash.deps, 'datasources', dss);
		},
	})
	@Query({
		failOnEmpty: (adm: ADM) => adm.stash?.deps?.credentials.length > 0,
		repo: 'Mysql.CredentialsVaultRepo',
		query: (adm: ADM) => `
			SELECT credentials_vault.id,
				   credentials_vault.name,
				   credentials_vault.description,
				   credentials_vault.accessibleTo,
				   credentials_vault.updatableTo,
				   credentials_vault.keyValues,
				   credentials_vault.createdAt,
				   credentials_vault.createdBy,
				   credentials_vault.updatedAt,
				   credentials_vault.updatedBy,
				   credentials_vault.active
			  FROM credentials_vault credentials_vault
		`,
		onSuccess: (adm: ADM) => {
			ESet(adm.stash.deps, 'credentials', adm.result);
		},
	})
	@GetList({
		repo: 'Mysql.ValueStore',
		checkOn: ['projectId'],
		input: (adm: ADM, lc: LogicChain) => {
			return {
				projectId: adm.input.projectId
			}
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			ESet(
				adm.stash.deps,
				'environmentVariables',
				adm.result
			);
		}
	})
	// // very cheap copy operation, a few Kilobytes of data copied on disk. This can be repeated without performance issues.
	@Command({
		command: (adm: ADM) => {
			const projectId = adm.input.projectId

			return `mkdir -m 744 -p ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/.build/con-${kebabCase(adm.stash.connection.name)} \
			&& cp -R ${process.env.ANSIBLE_CONNECTION_ROOT}/* ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/.build/con-${kebabCase(adm.stash.connection.name)}`;
		},
	})
	// update boilerplate
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const projectId = adm.input.projectId;

			return `find ${process.env.BOILER_PLATE_ROOT}/ -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitmodules' ! -name 'plugins' ! -name 'migration' -exec cp -R '{}' ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId} \\;`;
		},
	})
	@RenderTemplate({
		prettify: true,
		template: 'project-package',
		linter: 'json',
		templateVars: (adm: ADM) => ({
			name: kebabCase(adm.stash.project.projectName),
			description: filterString(adm.stash.project.details),
			author: `${adm.request.auth.user.firstName} ${adm.request.auth.user.lastName}`,
			dss: adm.stash.deps.datasources.filter((ds: any) => {
				return ds.type === 'rest-service' || ds.type === 'ws-service' || ds.type === 'eezze-logger';
			})
		})
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;

			return `/projects/${connection.projectId}`;
		},
		fileName: 'package.json',
		content: (adm: ADM) => adm.result,
	})

	// database migration
	@RenderTemplate({
		template: 'database-migration-sh',
		templateVars: (adm: ADM, lc: LogicChain) => {
			const databases: any = [];
			const connectionData = adm.stash.deps;

			for (const datasource of connectionData.datasources) {
				if (datasource.type === 'Mysql') {
					const metadata = EJson.parseKeyObject(datasource, 'metadata');

					databases.push({
						name: pascalCase(datasource.name),
						host: metadata.host,
						port: metadata.port
					});
				}	
			}

			return {
				databases: databases
			};
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;
			let projectId = connection.projectId;
			return `projects/${projectId}`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'runMigration.sh',
		content: (adm: ADM) => adm.result,
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const projectId = connection.projectId;

			return `chmod +x ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/runMigration.sh`
		},
	})

	// docker-compose file creation
	@Do({
		run: (adm: ADM, lc: LogicChain) => {
			function deepCopy(obj: any): any {
				return JSON.parse(JSON.stringify(obj));
			}

			function getCredentialValue(metadata: any, credentials: any, key: string) {
				if (metadata.credentials) {
					const cred = EJson.parseKeyObject(credentials, 'keyValues');

					for (const credItem of cred) {
						if (credItem.key === key) {
							return credItem.value;
						}
					}
				}
				return '';
			}

			type ComposeFile = {
				version: string; // 3.5
				services: {
					[serviceName: string]: ServiceConfig;
				},
				volumes?: {
					[volumeName: string]: {};
				};
			};

			type ServiceConfig = {
				user?: string;
				logging?: {
					options: {
					'max-size': string;
					};
				};
				image?: string; // eezzeio/mysql:5.7
				build?: {
					context: string;
					target: string;
					args: string[];
				};
				entrypoint?: string | string[];
				command?: string;
				ports?: string[];
				volumes?: string[];
				environment?: {
					[envName: string]: string;
				};
				restart: 'always' | 'no' | 'on-failure' | 'unless-stopped';
				depends_on?: string[];
			}

			const serviceTemplate: ServiceConfig = {
				user: "user:user",
				logging: {
				  options: {
					'max-size': '10m',
				  },
				},
				build: {
				  context: './',
				  target: 'eezze-api',
				  args: [
					'USER_ID=1000',
					'GROUP_ID=1000',
					`BUILD_FORCE=${generateRandomString(5)}`
				  ],
				},
				restart: 'always'
			  };
			
			const dockerComposeConfig: ComposeFile = {
				version: '3.5',
				services: {},
				volumes: {}
			};
			
			try {
				let hasDatabase = false;
				const connectionData = adm.stash.deps;
				let dependsOn: string[] = [];
				const datasourceCredentials: any = {};

				// First process any datasources, then other service types.
				for (const datasource of connectionData.datasources) {
					if (datasource.type === 'Mysql') {
						dependsOn.push(kebabCase(datasource.name));

						// for each Mysql type, apply defaults, only connection details change.
						// the first Mysql database also gets a phpMyAdmin container.
						const metadata = EJson.parseKeyObject(datasource, 'metadata');
						
						// set optionals
						let connection;
						let credentials;
						if (metadata.connection && connectionData.connection.id === metadata.connection) connection = connectionData.connection;
						if (metadata.credentials) {
							for (const cred of connectionData.credentials) {
								if (cred.id === metadata.credentials) credentials = cred;
							}
						}
						// init
						const dbService = deepCopy(serviceTemplate);
						delete dbService.user;
						delete dbService.build;
						dbService.image = 'eezzeio/mysql:5.7'; // custom image with an nginx page used for health check.
						dbService.ports = [];
						dbService.ports = [`${metadata.port}:${metadata.port}`, `8080:8080`];

						dbService.environment = {};
						if (metadata.dbName) dbService.environment['MYSQL_DATABASE'] = metadata.dbName;

						// if user is 'root', only set the root password env. variable
						if (getCredentialValue(metadata, credentials, metadata.user).toLowerCase() === 'root') {
							dbService.environment['MYSQL_ROOT_PASSWORD'] = getCredentialValue(metadata, credentials, metadata.password);
						} 
						else {
							dbService.environment['MYSQL_ROOT_PASSWORD'] = getCredentialValue(metadata, credentials, metadata.password);
							dbService.environment['MYSQL_USER'] = getCredentialValue(metadata, credentials, metadata.user);
							dbService.environment['MYSQL_PASSWORD'] = getCredentialValue(metadata, credentials, metadata.password);
							datasourceCredentials[metadata.user] = dbService.environment['MYSQL_USER'];
							datasourceCredentials[metadata.password] = dbService.environment['MYSQL_PASSWORD'];
						}

						dbService.volumes = ['db_data:/var/lib/mysql'];
						
						dockerComposeConfig.services[kebabCase(datasource.name)] = deepCopy(dbService);
						dockerComposeConfig.volumes['db_data'] = {}

						
						if (!hasDatabase) {
							// add PHPMyAdmin
							const php = deepCopy(serviceTemplate);

							delete php.user;
							delete php.build;
							php.image = 'phpmyadmin:latest';
							php.ports = [`80:80`];
							php.environment = {};
							php.environment['PMA_ARBITRARY'] = '1';

							dockerComposeConfig.services['phpmyadmin'] = deepCopy(php);
						}

						hasDatabase = true;
					}	
				}

				for (const datasource of connectionData.datasources) {
					if (datasource.type === 'rest-service' || datasource.type === 'ws-service' || datasource.type === 'eezze-logger') {
						const appName = kebabCase(datasource.name);
						const serviceContainer = deepCopy(serviceTemplate);
						const serviceMetadata = EJson.parseKeyObject(datasource, 'metadata');
						const sourceVolumeName = `${pascalCase(datasource.name)}Data`;
						const repoName = kebabCase(`${lc.stash.prop('projectId')}-backend-${lc.stash.prop('projectName')}`);
						const githubUsername = 'eezze-projects';
						
						// set optionals
						let serviceConnection;
						let serviceCredentials;
						if (serviceMetadata.connection && connectionData.connection.id === serviceMetadata.connection) serviceConnection = connectionData.connection;
						if (serviceMetadata.credentials) {
							for (const cred of connectionData.credentials) {
								if (cred.id === serviceMetadata.credentials) serviceCredentials = cred;
							}
						}

						// one service needs the data migration entry point
						// also set dependent to database service.
						if (dependsOn.length > 0) {
							serviceContainer.entrypoint = ['/usr/www/api/runMigration.sh'];
							serviceContainer.depends_on = deepCopy(dependsOn);

							dependsOn = [];
						}

						serviceContainer.command = `npm run ${appName}`;

						serviceContainer.ports = [];
						serviceContainer.ports.push(`${serviceMetadata.port}:${serviceMetadata.port}`);
						serviceContainer.ports.push(`${serviceMetadata.port + 1}:${serviceMetadata.port + 1}`); // temporary
						
						serviceContainer.build.args.push(`GIT_PROJECT_REPO_PATH=${githubUsername}/${repoName}`);
						serviceContainer.build.args.push(`GITHUB_TOKEN=${process.env.GITHUB_TOKEN}`);

						serviceContainer.environment = Object.fromEntries(
							connectionData.environmentVariables.map((item: { key: string; value: string }) => [item.key, item.value])
						);

						// map vault variables to env.
						if (Object.keys(datasourceCredentials).length  > 0) {
							for (const key in datasourceCredentials) {
								serviceContainer.environment[key] = datasourceCredentials[key];
							}
						}
						
						serviceContainer.volumes = [];
						serviceContainer.volumes.push(`/var/www/eezze:/var/www/eezze`); // default data path that we need to store
						
						dockerComposeConfig.services[appName] = deepCopy(serviceContainer);
						// we map the host directory with the guest directory instead.
						// dockerComposeConfig.volumes[sourceVolumeName] = {}
					}
				}
				
				ESet(adm.stash, 'dockerComposeConfig', jsonToYaml(dockerComposeConfig));
			}
			catch (err) { return {} }
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;
			const projectId = connection.projectId;

			return `projects/${projectId}/.build/con-${kebabCase(connection.name)}/docker/eezze`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'docker-compose.yml',
		content: (adm: ADM) => adm.stash.dockerComposeConfig,
	})
	
	// SSH Key generation  & setting Connection auth.
	// dependents; 
	// - inventory file.
	// - group vars.
	@Do({
		run: (adm: ADM) => {
			const connectionData = EJson.parseKeyObject(adm.stash.deps.connection, 'metadata');
			const credentials = adm.stash.deps.credentials;

			if (connectionData.auth 
				&& connectionData.auth.credentials
			) {
				for (const cred of credentials) {
					if (cred.id === connectionData.auth.credentials) {
						try {
							const keyValues = JSON.parse(cred.keyValues)
							const authObj: any = {};

							for (const keyValue of keyValues) {
								authObj[keyValue.key] = keyValue.value
							}
							ESet(
								adm.stash.deps,
								'connectionAuth',
								authObj
							);	
						} catch (err) {
						}
					}
				}
			}
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;
			let projectId = connection.projectId;

			return `projects/${projectId}/.build/con-${kebabCase(connection.name)}/ansible`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'ssh_key',
		content: (adm: ADM) => {
			const connectionMetadata = EJson.parseKeyObject(adm.stash.deps.connection, 'metadata');

			return adm.stash.deps.connectionAuth[connectionMetadata.auth.props.key];
		}
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const projectId = connection.projectId;

			return `cd ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/.build/con-${kebabCase(connection.name)}/ansible \
			&& chmod 600 ./ssh_key`;
		},
	})

	// Ansible inventory file
	@RenderTemplate({
		template: 'ansible-inventory',
		templateVars: (adm: ADM, lc: LogicChain) => {
			const connectionMetadata = EJson.parseKeyObject(adm.stash.deps.connection, 'metadata');
			const connectionAuth = adm.stash.deps.connectionAuth;
			const authObj = {
				key: connectionMetadata.auth.props.key,
				user: connectionMetadata.auth.props.user,
				password: connectionMetadata.auth.props.password
			}

			return {
				remote_ip_address: connectionMetadata.host,
				ssh_user: connectionAuth[authObj.user],
				sudo_password: connectionAuth[authObj.password],
				private_key: typeof authObj.key === 'string' && authObj.key.length > 0 ? true : false
			}
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;
			let projectId = connection.projectId;
			return `projects/${projectId}/.build/con-${kebabCase(connection.name)}/ansible`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'inventory.ini',
		content: (adm: ADM) => adm.result,
	})

	// Ansible group variables
	@RenderTemplate({
		template: 'ansible-group-vars',
		templateVars: (adm: ADM, lc: LogicChain) => {
			const repoName = kebabCase(`${lc.stash.prop('projectId')}-backend-${lc.stash.prop('projectName')}`);
			const githubUsername = 'eezze-projects';
			const connection = adm.stash.connection;
			const connectionMetadata = EJson.parseKeyObject(adm.stash.deps.connection, 'metadata');
			const connectionAuth = adm.stash.deps.connectionAuth;

			return {
				ssh_user: connectionAuth[connectionMetadata.auth.props.user],
				github_project_url_path: `${githubUsername}/${repoName}`,
				github_token: process.env.GITHUB_TOKEN,
				build_relative_dir: `/.build/con-${kebabCase(connection.name)}`
			}
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;
			let projectId = connection.projectId;
			return `projects/${projectId}/.build/con-${kebabCase(connection.name)}/ansible/playbooks/docker-install/group_vars`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'all',
		content: (adm: ADM) => adm.result,
	})

	// NOTE: this will auto apply any changes that were made to the Connection configuration.
	// on updates it will generally only affect the task definitions of AWS ECS.
	// in some cases security group and load balancer related changes when it comes to ports.
	// @Command({
	// 	command: (adm: ADM, lc: LogicChain) => {
	// 		const connection = lc.stash.prop('connection');
	// 		const projectId = connection.projectId;

	// 		return `git config --global url."https://oauth2:${process.env.GITHUB_TOKEN}@github.com/eezze/ansible-eezze-connection.git"/.insteadOf "ssh://git@github.com/eezze/ansible-eezze-connection"`;
	// 	},
	// })
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const projectId = connection.projectId;

			return `cd ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId} && git add . && git commit -m 'init ansible' && git push -u origin master`;
		}
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const projectId = connection.projectId;

			return `cd ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/.build/con-${kebabCase(connection.name)}/ansible \
				&& bash "install.sh"`;
		},
		onSuccess: (adm: ADM) => {
			console.log('The ansible execution was successful');
			
			adm.setSuccess('Ansible process successfully ran');
			adm.setResult(true);
		}
	})
	async _exec() {}
}
