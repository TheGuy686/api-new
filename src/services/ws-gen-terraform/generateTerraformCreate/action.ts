import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

import { LogicChain } from '@eezze/classes';
import { Command, DataTransformer, Do, EAction, FileSave, GetList, GetOne, Query, RenderTemplate } from '@eezze/decorators';
import { kebabCase, pascalCase, filterString } from '@eezze/libs/StringMethods';
import { ESet } from '@eezze/classes/logic';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ConnectionRepo',
	// add condition:
})
export default class GenerateTerraformCreateAction extends BaseAction {
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
			lc.stash.assign.text('projectRoot', `${process.env.PROJECTS_FILE_ROOT}/projects/${adm.result.id}`);
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
		checkOn: ['projectId', 'active'],
		input: (adm: ADM) => ({ projectId: adm.input.projectId, active: 1 }),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const dss: any = [];
			const creds: any[] = [];

			for (const ds of adm.result) {
				const md = EJson.parseKeyObject(ds, 'metadata');

				// only store datasources from this connection. md.connect is the same as connectionId.
				if (typeof md?.connection != 'undefined' && connection.id === md?.connection) {
					if (typeof md?.credentials != 'undefined') {
						creds.push(md?.credentials);
					}

					dss.push(ds);
				}
			}

			ESet(adm.stash.deps, 'credentials', creds);
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
			&& cp -R ${process.env.TERRAFORM_CONNECTION_ROOT}/* ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/.build/con-${kebabCase(adm.stash.connection.name)}`;
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

	// till here it's the same as ansible.
	// // Create the task definition object from all information gathered.
	@Do({
		run: (adm: ADM) => {
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

			function formatValue(value: any, depth: number): string {
				if (Array.isArray(value)) {
					const formattedArray = value.map(v => formatValue(v, depth + 1)).join(', ');

					return `[${formattedArray}]`;
				} else if (typeof value === 'object') {
					const formattedObject = Object.entries(value)
						.map(([key, val]) => {
							if (key === "environment_variables") {
								const formattedEnvVars = Object.entries(val)
									.map(([envKey, envVal]) => `${' '.repeat((depth + 1) * 2)}"${envKey}" = "${envVal}"`)
									.join('\n');

								return `${' '.repeat(depth * 2)}${key} = {\n${formattedEnvVars}\n${' '.repeat((depth + 1) * 2)}}`;
							}
							return `${' '.repeat(depth * 2)}${key.padEnd(20)} = ${formatValue(val, depth + 1)}`;
						})
						.join('\n');

					return `{\n${formattedObject}\n${' '.repeat((depth - 1) * 2)}}`;
				} else if (typeof value === 'string') {
					return `"${value}"`;
				} else {
					return value.toString();
				}
			}


			function formatTaskDefinitions(taskDefinitions: any[]): string {
				const formattedTasks = taskDefinitions.map(task => formatValue(task, 1)).join(',\n');
				return `[\n${formattedTasks}\n]`;
			}

			// defaults
			const taskObject: {
				task_name: string,
				cpu: number,
				memory: number,
				desired_count: number,
				scaling_enabled: boolean
				scale_up_schedule: string,    // "cron(40 6 * * ? *)" # UTC
				scale_down_schedule: string// "cron(45 6 * * ? *)"
				min_capacity: number, // 0
				max_capacity: number, // 1
				subnet_public: boolean, // true
				availability_zone: string, // "us-east-1a"
				subnet: string, // "10.0.1.0/24"
				volumes: any[],
				containers: any[]
			} = {
				task_name: '',
				cpu: 256,
				memory: 512,
				desired_count: 1,
				scaling_enabled: false,
				scale_up_schedule: 'cron(40 6 * * ? *)',    // "cron(40 6 * * ? *)" # UTC
				scale_down_schedule: 'cron(45 6 * * ? *)', // "cron(45 6 * * ? *)"
				min_capacity: 1, // 0
				max_capacity: 1, // 1
				subnet_public: true, // true
				availability_zone: 'us-east-1a', // "us-east-1a"
				subnet: '10.0.1.0/24', // "10.0.1.0/24"
				volumes: [{ name: 'Data' }],
				containers: []
			}
			const containerObject: {
				service_name: string, // "phpmyadmin"
				container_image: string, // "phpmyadmin:latest"
				cpu: number, // 64
				memory: number, // 128
				alb_path: string, // "/*"
				alb_redirect: any, //
				entryPoint: string[], // Required for custom images only!
				command: string[],
				port_mappings: any[],
				environment_variables: any,
				secret_variables: any, // Secrets Manager environment variables
				mount_points: any[],
				health_check: any
			} = {
				service_name: '',
				container_image: '',
				cpu: 256,
				memory: 512,
				alb_path: "/*", // if not using a dedicated domain, delete this.
				alb_redirect: { // optional, must be deleted for APIs.
					path: "/",
					status_code: "HTTP_301",
					host_header: ["phpmyadmin.eezze.io"],
					http_methods: ["GET"]
				},
				entryPoint: [],
				command: [],
				port_mappings: [{ // Mysql database defaults.
					container_port: 3306,
					host_port: 3306,
					protocol: 'tcp',
					primary: true //! @todo: change to default false when internal dns is fixed ! No load balancer forwarding, all ports set to false
				}],
				environment_variables: {
					MYSQL_ROOT_PASSWORD: '' // Mysql default.
				},
				secret_variables: {},
				mount_points: [{  // defaults for MySQL database, change gid and uid to 1000 for other container types (REST, WS)
					container_path: '/db_data', // or /var/www/eezze for custom containers
					source_volume: 'Data',
					read_only: false,
					gid: '999',
					uid: '999'
				}],
				health_check: {
					command: ["CMD-SHELL", "curl -f http://localhost || exit 1"],
					interval: 30,
					timeout: 10,
					protocol: 'HTTP', // Mandatory health check on ALB Target Group via HTTP, because we have the "IP" target type (Fargate).
					path: '/',
					port: 80
				}
			}

			try {
				let hasDatabase = false;
				const connectionData = adm.stash.deps;
				const project = adm.stash.project;
				const tasks = [];
				const privateContainerList = new Set();
				const datasourceCredentials: any = {};
				let publicContainerList = '';
				let ecrList = new Set();

				let dependsOn: string[] = [];

				for (const datasource of connectionData.datasources) {
					if (datasource.type === 'Mysql') {
						dependsOn.push(kebabCase(datasource.name));

						// for each Mysql type, apply defaults, only connection details change.
						// the first Mysql database also gets a phpMyAdmin container.
						const container = deepCopy(containerObject);
						const metadata = EJson.parseKeyObject(datasource, 'metadata');
						const taskName = `${kebabCase(`${project.projectName}-db-${datasource.name}`)}`;

						const dbImageName = 'eezzeio/mysql';  // old; mysql:5.7.12, 7 years old!
						// set optionals
						let connection;
						let credentials;
						if (metadata.connection && connectionData.connection.id === metadata.connection) connection = connectionData.connection;
						if (metadata.credentials) {
							for (const cred of connectionData.credentials) {
								if (cred.id === metadata.credentials) credentials = cred;
							}
						}

						container.service_name = kebabCase(datasource.name);
						container.container_image = `${dbImageName}:5.7`; // custom image with an nginx page used for health check.
						container.health_check.port = 8080; // nginx is running on port 8080, this is only for the ALB Target Group health check. 
						container.health_check.command = ["CMD-SHELL", "curl -f http://localhost:8080 || exit 1"];

						if (!hasDatabase) {
							container.cpu = 192
							container.memory = 384
						}
						container.port_mappings[0].container_port = metadata.port
						container.port_mappings[0].host_port = metadata.port
						container.port_mappings.push({ // health check port
							container_port: 8080,
							host_port: 8080,
							protocol: "tcp",
							primary: false
						})

						if (metadata.dbName) container.environment_variables.MYSQL_DATABASE = metadata.dbName;
						container.environment_variables.MYSQL_ROOT_PASSWORD = getCredentialValue(metadata, credentials, metadata.password);
						container.environment_variables.MYSQL_USER = getCredentialValue(metadata, credentials, metadata.user);
						container.environment_variables.MYSQL_PASSWORD = getCredentialValue(metadata, credentials, metadata.password);
						datasourceCredentials[metadata.user] = container.environment_variables.MYSQL_USER;
						datasourceCredentials[metadata.password] = container.environment_variables.MYSQL_PASSWORD;

						// delete container.alb_path;
						// delete container.alb_redirect;
						container.alb_redirect.host_header = [`${container.service_name}-${kebabCase(project.projectName)}.eezze.io`]
						delete container.alb_redirect.http_methods;

						const task = deepCopy(taskObject);
						task.task_name = taskName;
						task.containers.push(container);

						if (!hasDatabase) {
							// add PHPMyAdmin
							const php = deepCopy(containerObject);

							php.service_name = 'phpmyadmin';
							php.container_image = 'phpmyadmin:latest';
							php.cpu = 64
							php.memory = 128

							php.port_mappings[0].container_port = 80
							php.port_mappings[0].host_port = 80
							php.port_mappings[0].primary = true

							php.alb_redirect.host_header = [`phpmyadmin-${kebabCase(project.projectName)}.eezze.io`]

							php.environment_variables.PMA_ARBITRARY = '1';
							delete php.environment_variables.MYSQL_ROOT_PASSWORD;

							task.containers.push(php);
							publicContainerList = `phpmyadmin:phpmyadmin:latest`;
							ecrList.add('phpmyadmin');
						}

						hasDatabase = true;

						publicContainerList = publicContainerList + `, ${container.service_name}:${dbImageName}:5.7`; // old; mysql:5.7.12

						ecrList.add(dbImageName);
						tasks.push(task);
					}	
				}

				for (const datasource of connectionData.datasources) {
					if (datasource.type === 'rest-service' || datasource.type === 'ws-service' || datasource.type === 'eezze-logger') {
						const appName = kebabCase(datasource.name);
						const serviceContainer = deepCopy(containerObject);
						const serviceMetadata = EJson.parseKeyObject(datasource, 'metadata');
						const sourceVolumeName = `${pascalCase(datasource.name)}Data`;
						const containerImageName = `294648980860.dkr.ecr.us-east-1.amazonaws.com/${kebabCase(`${project.projectName}`)}:latest` // for now there's just 1 image, all code in the project.
						const taskName = `${kebabCase(`${project.projectName}-service-${datasource.name}`)}`;

						// set optionals
						let serviceConnection;
						let serviceCredentials;
						if (serviceMetadata.connection && connectionData.connection.id === serviceMetadata.connection) serviceConnection = connectionData.connection;
						if (serviceMetadata.credentials) {
							for (const cred of connectionData.credentials) {
								if (cred.id === serviceMetadata.credentials) serviceCredentials = cred;
							}
						}

						serviceContainer.service_name = kebabCase(datasource.name);
						serviceContainer.container_image = containerImageName;

						serviceContainer.cpu = 256;
						serviceContainer.memory = 1024;

						// one service needs the data migration entry point
						// also set dependent to database service.
						if (dependsOn.length > 0) {
							serviceContainer.command = [`/usr/www/api/runMigration.sh && npm run ${appName}`];
							
							dependsOn = [];
						} 
						else {
							serviceContainer.command = [`npm run ${appName}`];
						}

						serviceContainer.entryPoint = ["/bin/bash", "-c"];
						
						serviceContainer.health_check.port = serviceMetadata.port + 1; // temporary
						serviceContainer.health_check.path = '/';
						serviceContainer.health_check.command = ["CMD-SHELL", `curl -f http://localhost:${serviceContainer.health_check.port}${serviceContainer.health_check.path} || exit 1`],

						// main port
						serviceContainer.port_mappings[0].container_port = serviceMetadata.port;
						serviceContainer.port_mappings[0].host_port = serviceMetadata.port;

						// health check port mapping
						serviceContainer.port_mappings.push({
							container_port: serviceMetadata.port + 1,
							host_port: serviceMetadata.port + 1,
							protocol: 'tcp',
							primary: false
						});

						serviceContainer.environment_variables = Object.fromEntries(
							connectionData.environmentVariables.map((item: { key: string; value: string }) => [item.key, item.value])
						);

						// map vault variables to env.
						if (Object.keys(datasourceCredentials).length  > 0) {
							for (const key in datasourceCredentials) {
								serviceContainer.environment_variables[key] = datasourceCredentials[key];
							}
						}

						serviceContainer.mount_points[0].container_path = '/var/www/eezze'; // default data path that we need to store
						serviceContainer.mount_points[0].source_volume = sourceVolumeName;
						serviceContainer.mount_points[0].gid = '1000';
						serviceContainer.mount_points[0].uid = '1000';

						// delete serviceContainer.alb_path;
						// delete serviceContainer.alb_redirect;
						serviceContainer.alb_redirect.host_header = [`${serviceContainer.service_name}-${kebabCase(project.projectName)}.eezze.io`]
						delete serviceContainer.alb_redirect.http_methods;

						const serviceTask = deepCopy(taskObject);
						serviceTask.task_name = taskName;
						serviceTask.volumes = [{ name: sourceVolumeName }],
							serviceTask.cpu = 256;
						serviceTask.memory = 1024;

						serviceTask.containers.push(serviceContainer);
						tasks.push(serviceTask);

						privateContainerList.add(`${serviceContainer.service_name}:${kebabCase(`${project.projectName}`)}:latest`) // for now, a unique image per project.
						ecrList.add(kebabCase(project.projectName));
					}
				}

				ESet(adm.stash, 'privateContainerList', Array.from(privateContainerList).map(item => item).join(', '));
				ESet(adm.stash, 'ecrList', Array.from(ecrList).map(item => item).join(', '));
				if (publicContainerList !== '') ESet(adm.stash, 'publicContainerList', publicContainerList);
				ESet(adm.stash, 'tasks', formatTaskDefinitions(tasks));
			}
			catch (err) { return {} }
		}
	})
	// // service groups, get services types, for each type a container within the same task.
	// // for each dataabase datasource, a dedicated task and container, only the first database also has PHPMyAdmin.
	@RenderTemplate({
		template: 'terraform-tfvar',
		templateVars: (adm: ADM, lc: LogicChain) => {
			const connectionData = adm.stash.deps;
			const project = adm.stash.project;
			const projectName = kebabCase(project.projectName);

			const projectId = connectionData.connection.projectId;
			const repoName = kebabCase(`${projectId}-backend-${projectName}`);
			const githubUsername = 'eezze-projects';// store in application wide system config.
			const gitRepoPath = `${kebabCase(githubUsername)}/${repoName}`; // store in project db.
			const publicContainerList = adm.stash.publicContainerList !== undefined ? adm.stash.publicContainerList : '' // if there's no database, empty string ''

			return {
				private_container_list: adm.stash.privateContainerList, // service_name:image_name
				public_container_list: publicContainerList,
				ecr_list: adm.stash.ecrList,
				project: projectName,
				connection_name: kebabCase(connectionData.connection.name),
				github_project_repo_path: gitRepoPath,
				github_token: process.env.GITHUB_TOKEN,
				task_definitions: adm.stash.tasks
			}
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;

			let serviceId = kebabCase(connection.serviceId);
			let projectId = connection.projectId;
			let type = connection.type;

			return `projects/${projectId}/.build/con-${kebabCase(connection.name)}`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'terraform.tfvars',
		content: (adm: ADM) => adm.result,
	})

	@RenderTemplate({
		template: 'terraform-state',
		templateVars: (adm: ADM, lc: LogicChain) => {
			const connectionData = adm.stash.deps;
			const project = adm.stash.project;

			const projectName = kebabCase(project.projectName);
			const connectionName = kebabCase(connectionData.connection.name);

			return {
				projectId: project.id,
				project: projectName,
				connection_name: connectionName
			}
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const connection = adm.stash.connection;
			let projectId = connection.projectId;
			return `projects/${projectId}/.build/con-${kebabCase(connection.name)}`
		},
		fileName: (adm: ADM, lc: LogicChain) => 'state.tf',
		content: (adm: ADM) => adm.result,
	})

	// // NOTE: this will auto apply any changes that were made to the Connection configuration.
	// // on updates it will generally only affect the task definitions of AWS ECS.
	// // in some cases security group and load balancer related changes when it comes to ports.
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const projectId = connection.projectId;

			return `cd ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/.build/con-${kebabCase(connection.name)} && terraform init -upgrade && terraform apply -y`;
		},
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const connection = lc.stash.prop('connection');
			const projectId = connection.projectId;

			return `cd ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId} \
			&& git add . \
			&& git commit -m 'init terraform' \
			&& git push -u origin master`
		}
	})
	// Deploy code to AWS ECS containers
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `aws codepipeline start-pipeline-execution --name prod-${kebabCase(adm.stash.project.projectName)}-codepipeline --profile eezze-prod`;
		},
		onSuccess: (adm: ADM) => {
			console.log('Terraform execution successful');

			adm.setSuccess('Terraform success');
			adm.setResult(true);
		}
	})
	async _exec() { }
}
