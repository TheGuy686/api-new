import { convertToCapitalCase, kebabCase, pascalCase, pluralize, underscoreCase } from '../libs/StringMethods';
import { dirDirectories, dirFiles, fileExists, mkdir, readFile } from '../libs/FileMethods';
import { getDefaultModel } from './defaults/DefaultModel';
import { createDefaultRepo } from './defaults/RepoDefault';

import Logger from './Logger';
import entityDefaults from '../consts/entity-defaults';

const PDC = require('../../../dist/plugins/eezze/classes/ProjectDependancyCaches').default;

const defaultKeys: any = entityDefaults.defaultKeys;

export default class ProjectDependancyCaches {
	private static projectConnectionsRoot = `${__dirname}/../../../src/connections`;
	private static projectDssRoot = `${__dirname}/../../../src/datasources`;
	private static projectModelsRoot = `${__dirname}/../../../src/models`;
	private static projectReposRoot = `${__dirname}/../../../src/repos`;
	private static projectServersRoot = `${__dirname}/../../../src/servers`;
	private static projectServiceConfigurablesRoot = `${__dirname}/../../../src/service-configurables`;
	private static projectServicesRoot = `${__dirname}/../../../src/services`;

	private static _defaultDsTypes: string[] = [ 'FileStorage',  'SmtpMailService' ];

	private static _authenticators: any = {};
	private static _connections: any = {};
	private static _datasources: any = {};
	private static _servers: any = {};
	private static _models: any = {};
	private static _repos: any = {};
	private static _serviceConfigs: any = {};
	private static _sgs: any = {};

	private static logger: Logger;

	private static initLogger(logger: Logger) { this.logger = logger}

	private static async cacheAllConnections() {
		const connectionFiles = dirFiles(this.projectConnectionsRoot);

		for (const con of connectionFiles) {
			const conKey = con.replace(/\.ts/, '');
			const c = await import(`${this.projectConnectionsRoot}/${conKey}`);

			this._connections[pascalCase(conKey)] = c.default;

			if (typeof c.default == 'undefined') {
				console.log(`CRITICAL: "connections/${conKey}" didn't have a default export. Please make sure you have declared your connection class with the "export 'default'" included`);
				process.exit();
			}
		}
	}

	private static async cacheAllDs() {
		if (!fileExists(this.projectDssRoot)) mkdir(this.projectDssRoot);

		let dss = dirFiles(this.projectDssRoot),
			ds: string,
			servs = dirFiles(this.projectServersRoot);

		// first we need to cache all the datasources
		for (ds of dss) {
			const dsKey = ds.replace(/\.ts/, '');
			const d = await import(`datasources/${dsKey}`);

			const mdi = {
				key: dsKey,
				class: Object.getPrototypeOf(d.default).name,
				baseType: d.default.props.datasourceType,
				isDefault: this._defaultDsTypes.includes(d.default.props.datasourceType),
				type: d.default.props.datasourceType,
				props: d.default.props,
			};

			if (!d.default.metadata) {
				Object.defineProperty(d.default, 'metadata', {
					value: mdi,
					writable: false,
					configurable: false,
				});
			}

			this._datasources[dsKey] = d.default;
		}

		let ser: string;

		// Then we need to cache the servers as these are dependancies of "REST" | "WS" types.
		// When we insert a DS on the FE then we will generate a server if we choose a "REST" or "WS" is chosen
		for (ser of servs) {
			const dsKey = ser.replace(/\.ts/, '');

			const s = await import(`${this.projectServersRoot}/${ser}`);

			this._servers[dsKey] = s.default;

			const ins = new (s.default)();

			PDC.registerServer(s.default.props.key, ins);

			await ins.run(false);
		}
	}

	private static cacheModel(key: string, model: any) {
		model.logger = this.logger;
		this._models[key] = model;
	}

	private static async cacheAllModels() {
		if (!fileExists(this.projectModelsRoot)) mkdir(this.projectModelsRoot);

		let models = dirFiles(this.projectModelsRoot), model: string;

		// cache a default model for all the default datasources in the project
		const dss = Object.values(this._datasources ?? []) as any;

		if (dss.length > 0) {
			for (const ds of dss) {
				if (!ds.metadata.isDefault) continue;

				const mdl = getDefaultModel(ds.metadata.type);

				this.cacheModel(mdl.name, mdl.ins);
			}
		}

		for (model of models) {
			const e = await import(`models/${model}`);

			this.cacheModel(pascalCase(model), e.default);
		}
	}

	private static getEntity(entityKey: string) {
		entityKey = `${entityKey.replace(/Model$/, '')}Model`;

		if (typeof this._models[entityKey] == 'undefined') {
			console.log('this.models: ', entityKey, ' : ', Object.keys(this._models));
			throw `Model with key: "${entityKey}" did not exist`;
		}

		return this._models[entityKey];
	}

	private static cacheRepo(dsType: string, entityName: string, repo: any, logger: Logger) {
		const repoProps: any = repo.metadata.props;

		const te = repoProps.targetEntity.toLowerCase();
		const tePlural = pluralize(te);

		repo.logger = logger;
		repo.group = tePlural;

		const mdl = this.getEntity(repoProps.targetEntity)
		mdl.getParentName()

		// repo.table = tePlural;
		repo.table = underscoreCase(repoProps.targetEntity);
		repo.model = mdl;

		try {
			repo.ds = (new (this._datasources[kebabCase(repoProps.datasource)])).ds;

			this._repos[`${pascalCase(dsType)}.${pascalCase(entityName.replace(/Model$/, 'Repo'))}`] = repo;

			const mdlName = pascalCase(entityName.replace(/model$/, '').replace(/repo$/, '') + 'Model');

			if (this._models[mdlName]) {
				this._models[mdlName].repo = repo;
			}
		}
		catch (e) {
			console.log('\n\n');
			console.log(`ProjectDependancyCaches.cacheRepo: CRITICAL ERROR CACHING REPO. Error: ${e.message}`);
			console.log(`Looking for "${pascalCase(dsType)}.${pascalCase(entityName)}"`);
			console.log('dsType: ', dsType);
			console.log('Entity: ', entityName);
			console.log('repo: ', repo);
			console.log('\n');
			console.log('Datasources: ', kebabCase(repoProps.datasource), ' : ', this._datasources);
			console.log(e);
			console.log('\n\n');
			process.exit();
		}
	}

	private static async cacheAllRepos() {
		let repoDsType: string,
			repo: string;

		if (!fileExists(this.projectReposRoot)) mkdir(this.projectReposRoot);

		let repoTypes = dirFiles(this.projectReposRoot);;

		const dss = Object.values(this._datasources ?? []) as any[];

		let r: any;

		// loop through all the datasources in the project to see if
		// there is any defualt repositories that need to be cached
		if (dss.length > 0) {
			for (const ds of dss) {
				if (!ds.metadata.isDefault) continue;

				const dsType = ds.metadata.type;

				const defArgs: any = { datasourceType: dsType };

				switch (dsType) {
					case 'FileStorage': {
						defArgs.targetEntity = defaultKeys.FileStorage;
						defArgs.datasource = ds.metadata.class;

						r = createDefaultRepo(defArgs);
						break;
					}
					case 'SmtpMailService': {
						defArgs.targetEntity = defaultKeys.SmtpMailService;
						defArgs.datasource = ds.metadata.class;

						r = createDefaultRepo(defArgs);
						break;
					}
				}

				this.cacheRepo(
					defArgs.datasourceType,
					defArgs.targetEntity.replace(/Model$/, '') + 'Model',
					r,
					this.logger,
				);

				// console.log('COOKE: ', ds.metadata, this.repos);
			}
		}

		// loop through all the repos that exist in the project
		for (repoDsType of repoTypes) {
			const repos = dirFiles(`${this.projectReposRoot}/${repoDsType}`, '.ts');

			for (repo of repos) {
				repo = repo.substring(0, repo.length - 3);

				const defRepo = await import(`repos/${repoDsType}/${repo}`);

				this.cacheRepo(
					repoDsType,
					repo,
					defRepo.default,
					this.logger
				);
			}
		}
	}

	private static async cacheServiceConfigs() {
		const scsp = this.projectServiceConfigurablesRoot;

		if (!fileExists(scsp)) mkdir(scsp);

		// loop over each type of service config "render-templates, email-templates"
		for (const type of dirDirectories(scsp)) {
			for (const tpl of dirFiles(`${scsp}/${type}`)) {
				if (typeof this._serviceConfigs[type] == 'undefined') {
					this._serviceConfigs[type] = [];
				}

				this._serviceConfigs[type].push({
					type,
					file: tpl,
					content: readFile({
						path: `${scsp}/${type}`,
						file: tpl,
					}),
				});
			}
		}
	}

	private static async cacheAllAuthenticators() {
		let services = dirFiles(this.projectServicesRoot), service: string;

		for (const service of services) {
			if (fileExists(`${this.projectServicesRoot}/${service}/authenticator.ts`)) {
				this._authenticators[pascalCase(service)] = (await import(`services/${service}/authenticator`)).default;
			}
		}
	}

	private static async cacheSgController(serviceGroupKey: string, microServicesRoot: string, type: string) {
		let cnt: any;

		if (!fileExists(`${microServicesRoot}/controller.${type}.ts`)) return;

		try {
			cnt = await import(`${microServicesRoot}/controller.${type}.ts`);

			if (fileExists(`${microServicesRoot}/config.yaml`)) {
				try {
					const yamlConfig = readFile({
						path: `${microServicesRoot}/`,
						file: 'config.yaml',
						type: 'yaml',
					});

					this._sgs[serviceGroupKey][type].config = yamlConfig;
				}
				catch (err) {}
			}

			this._sgs[serviceGroupKey][type].props = cnt.default.props;
		}
		catch (e) {
			console.log(e.message);
			console.log(`Could not read the file: "${microServicesRoot}controller.${type}.ts"`);
			process.exit();
		}
	}

	private static async cacheAllServiceGroups() {
		let sgs = dirFiles(this.projectServicesRoot), sg: string;

		for (sg of sgs) {
			const sgCcKey = pascalCase(sg);

			const microServicesRoot = `${this.projectServicesRoot}/${sg}`;

			const isAuthenticator = fileExists(`${microServicesRoot}/authenticator.ts`);

			if (typeof this._sgs[sgCcKey] == 'undefined') {
				let authConfig = {}, action: any = {};

				if (isAuthenticator) {
					const auth = await import(`${microServicesRoot}/authenticator.ts`);

					authConfig = auth.default.props;
				}				

				const rest: any = {}, ws: any = {}, cron: any = {}

				const allServices = PDC.services[`${sgCcKey}Service`];

				for (const servKey in allServices) {
					const serv = allServices[servKey];

					let servFileInfo: any;

					try {
						servFileInfo = PDC.getCachedServiceFile(sgCcKey, servKey);
					}
					catch (err) {
						console.log('Error: ', err, sgCcKey, servKey);
					}
					
					const serIns = await import(`${servFileInfo.path}/action`);

					const servIn = {
						keyCc: servKey,
						keyKc: kebabCase(servKey),
						name: convertToCapitalCase(servKey),
						metadata: serIns.default.metadata,
						instance: serIns.default,
						...serv,
					};

					switch (serv?.service?.type) {
						case 'restful': {
							rest[servKey] = servIn;
							break;
						}
						case 'websocket': {
							ws[servKey] = servIn;
							break;
						}
						// default to cron
						default: {
							cron[servKey] = servIn;
						}
					}
				}

				this._sgs[sgCcKey] = {
					key: sgCcKey,
					name: convertToCapitalCase(sgCcKey),
					auth: {
						isAuthenticator,
						config: authConfig,
					},
					rest: { props: {}, config: {}, services: rest },
					ws: { props: {}, config: {}, services: ws },
					cron: { props: {}, config: {}, services: cron },
				};
			}

			await this.cacheSgController(sgCcKey, microServicesRoot, 'rest');
			await this.cacheSgController(sgCcKey, microServicesRoot, 'ws');

			// first loop over the difference types "rest, ws and cron"
			for (const sgType in this._sgs[sgCcKey]) {
				// then loop over each service in the sg
				for (const si in this._sgs[sgCcKey][sgType].services) {
					const serv = this._sgs[sgCcKey][sgType].services[si];

					if (fileExists(`${microServicesRoot}/${si}/input.ts`)) {
						const ai = await import(`${microServicesRoot}/${si}/input.ts`);

						serv.service.input = ai.default.inputProps;
					}

					const chain = [];

					if (fileExists(`${microServicesRoot}/${si}/action.ts`)) {
						let act = await import(`${microServicesRoot}/${si}/action.ts`);

						act = new (act.default)();

						// loop over each item in the action chain and then push to the ac description array
						for (const a of act.actionChain) {
							chain.push({ action: a.src, params: a.params });
						}
					}
					
					serv.service.action = chain;
				}
			}
		}
	}

	static async initDependancyCache(logger: Logger) {
		this.initLogger(logger);

		// we need to do this first to make sure that we can access the server   
		// instances in the class instances in the PDC.initDependancyCache
		await this.cacheAllDs();

		await PDC.initDependancyCache({ logger: this.logger });

		await this.cacheAllAuthenticators();
		await this.cacheAllServiceGroups();
		await this.cacheAllConnections();
		await this.cacheServiceConfigs();
		await this.cacheAllModels();
		await this.cacheAllRepos();

		const mdlsIn: any = {};

		let mdl: any;

		for (mdl of Object.values(this._models)) {
			if (!mdl.repo && mdl?.metadata?.isDefault) continue;

			const dsName = mdl.repo.ds.props.className;

			if (typeof mdlsIn[dsName] == 'undefined') {
				mdlsIn[dsName] = {
					ds: this._datasources[kebabCase(dsName)],
					models: [],
				}
			}

			mdl._properties = JSON.parse(JSON.stringify(mdl.modelProps));

			const mdlName = convertToCapitalCase((mdl?.metadata?.name ?? '').replace(/Model$/, '').replace(/-model$/, ''));

			mdlsIn[dsName].models.push({
				name: mdlName,
				properties: JSON.parse(JSON.stringify(mdl.modelProps)),
				ins: mdlsIn,
			});
		}

		return {
			models: mdlsIn,
			connections: this._connections,
			datasources: this._datasources,
			serviceConfigs: this._serviceConfigs,
			serviceGroups: this._sgs,
		}
	}
}