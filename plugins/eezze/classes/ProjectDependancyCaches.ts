import { getLogger } from '..';
import { Logger } from '../classes';
// import { RepoArgs } from '../decorators';
import { dirFiles, dirDirectories, fileExists, readFile, mkdir } from '../libs/FileMethods';
import { kebabCase, pascalCase, pluralize, ucFirst, underscoreCase } from '../libs/StringMethods';
import { RelationI } from '../interfaces/RelationsI';
import { EntityPropsI } from '../interfaces/EntityPropsI';
import { createDefaultRepo } from './defaults/RepoDefault';
import { getDefaultModel } from './defaults/DefaultModel';

import entityDefaults from '../consts/entity-defaults';

import ServiceBus from './ServiceBus';

const defaultKeys: any = entityDefaults.defaultKeys;

interface DependancyPairsI { [key: string]: any }

const deps: any = {
    'System': require('../libs/System').default
}

interface FILE_DEPENDANCY_PATHS {
    services: any;
    actions: any;
    modelActions: any;
    actionInputs: any;
    servicesDeps: any;
}

type CACHE_TYPE = 'restful' | 'websocket';

interface CacheDependancyArgsI {
    logger: Logger;
    cacheType?: CACHE_TYPE;
}

function toObject(string: string, delimiter: string = ', ') {
    const properties = string.split(delimiter);
    const obj: any = {};
    properties.forEach(function (property) {
        if (/^.*?\/\//.test(property)) return;

        const tup = property.split(':');
        const key = tup[0].trim();
        const value = tup[1].trim();

        obj[key] = eval(value);
    });
    return obj;
}

export default class ProjectDependancyCaches {
    private static authenticators: DependancyPairsI = {};
    private static repos: DependancyPairsI = {};
    private static connections: DependancyPairsI = {};
    private static connectionsIns: DependancyPairsI = {};
    private static models: DependancyPairsI = {};
    private static actionInputs: DependancyPairsI = {};
    private static datasources: DependancyPairsI = {};
    private static projectServersRoot = `${__dirname}/../../../../src/servers`;
    private static projectServicesRoot = `${__dirname}/../../../../src/services`;
    private static projectServicesDistRoot = `${__dirname}/../../../src/services`;
    private static serviceConfigs: any = {};
    private static controllerArgs: any = {};
    private static controllerArgsRefs: { [service: string]: string } = {};
    private static serverConfigs: any = {};
    private static servers: any = {};
    private static dsPrimitiveConfigs: any = {};
    private static _dsDescArgs: any = {};
    private static _defaultDsTypes: string[] = [ 'FileStorage',  'SmtpMailService' ];

    public static get services() {return ServiceBus.services }

    /**
       Example entity reference:

       'OrderTable': {
           'id': {
               name: 'id',
               type: 'integer',
               isEntity: false,
               isTransient: true //  values are not stored and queried from the database
           }
       }
    */
    private static entityProperties: { [key: string]: EntityPropsI } = {};

    public static setDsDescArgs(key: string, args: any) {
        this._dsDescArgs[key] = args;
    }

    /**
        Example relation reference:

        'OrderTableModel': {
            name: 'OrderTableModel',
            tableName: 'order_table',
            relations: {
                'createdBy': {
                    type: 'OneToOne',
                    name: 'UserModel',
                    joinAttributes: [ 'userId' ],
                }
            }
        }
     */
    private static relationRefs: { [key: string]: RelationI } = {};

    public static entityPropExists(entityName: string, property: string) {
        try {
            return typeof this.entityProperties[entityName] === 'object'
            && typeof this.entityProperties[entityName][property] === 'object';
        }
        catch (err) {
            console.log(`There was an error checking if the entiry->prop "${entityName}->${property}" exists: `, err);
            return false;
        }
    }

    public static registerEntityProps(entityName: string, prop: string, type: string, isEntity: boolean, isTransient: boolean, defaultValue?: any, relationType?: { code: string, name: string }) {
        if (typeof this.entityProperties[entityName] !== 'object') {
            this.entityProperties[entityName] = {};
        }

        this.entityProperties[entityName][prop] = { name: prop, type, isEntity, isTransient, defaultValue, relationType };
    }

    public static getEntityProps(entityName: string): EntityPropsI {
        if (typeof this.entityProperties[entityName] !== 'object') {
            throw new Error(`PDC.getEntityProps: error ${entityName} doesn't exist.`)
        }
        return { ...this.entityProperties[entityName] };
    }

    public static relationExists(model: string, property: string) {
        return typeof this.relationRefs[model] === 'object'
            && typeof this.relationRefs[model].relations !== 'undefined'
            && typeof this.relationRefs[model].relations[property] === 'object';
    }

    public static relationHasChildren(model: string) {
        return typeof this.relationRefs[model] === 'object'
            && typeof this.relationRefs[model].relations !== 'undefined'
            && Object.keys(this.relationRefs[model].relations).length > 0;
    }

    public static registerRelation(model: string, property: string, name: string, type: string, joinOn: string[] = [], column: string, foreignKey: string, owner?: string, direction?: string) {
        if (typeof this.relationRefs[model] === 'undefined') {
            this.relationRefs[model] = { name: model, tableName: this.getTableName(model), relations: {} };
        }

        this.relationRefs[model].relations[property] = { type, name, joinOn, column, foreignKey, owner, direction };
    }

    public static relation(model: string): RelationI {
        try {
            return this.relationRefs[model];
        }
        catch (error) {
            console.error(error.message);
            throw new Error(`Relations for "${model}" wasn't set`)
        }
    }

    // special indicator for models with child relations set in place of foreign key properties.
    public static CHILD_RELATIONSHIP = 'CHILD_RELATIONSHIPS';

     /**
     * Return table name from an Eezze model name.
     *
     * @param modelName Eezze model name
     * @returns
     */
     public static getTableName(modelName: string): string {
        const entityName = modelName.replace('Model', '');

        return underscoreCase(entityName);
    }

    public static getRelationsByTableName(tableName: string): RelationI {
        try {
            const modelName = `${pascalCase(tableName)}Model`;

            const relations = this.relationRefs[modelName];

            if (typeof relations === 'undefined') {
                return {
                    name: modelName,
                    tableName,
                    relations: {}
                }
            }

            return relations;
        }
        catch (error) {
            console.error(error.message);
            throw new Error(`Relations for "${tableName}" wasn't set`)
        }
    }

    private static filePaths: FILE_DEPENDANCY_PATHS = {
        services: {},
        actions: {},
        modelActions: {},
        actionInputs: {},
        servicesDeps: {},
    };

    public static async cacheServerProps() {
        const servers = dirFiles(`${this.projectServersRoot}`);

        try {
            for (const ser of servers) {
                const s = await import(`${this.projectServersRoot}/${ser}`);

                this.serverConfigs[s.default.props.key] = s.default.props;
            }
        }
        catch (err) {
            console.log(`Couldn't cache the servers`);
            console.log('Error: ', err);
            process.exit();
        }
    }

    public static registerServer(serverKey: string, server: any) {
        this.servers[serverKey] = server;
    }

    public static getServer(serverKey: string) {
        if (typeof this.servers[serverKey] == 'undefined') {
            console.log('Servers: ', this.servers);
            throw new Error(`Server "${serverKey}" didn't exist`);
        }
        return this.servers[serverKey];
    }

    public static getAuthenticator(key: string) {
        if (typeof this.authenticators[key] == 'undefined') {
            console.log(this.authenticators);
            throw new Error(`Authenticator "${key}" wasn't set`)
        }

        return this.authenticators[key];
    }

    public static registerActionInput(key: string, actionInput: any) {
        this.actionInputs[key] = actionInput;
    }

    // public static registerServerConfigs(serverKey: string, configs: any) {
    //     this.serverConfigs[serverKey] = configs;
    // }

    public static getServerConfigs(serverKey: string) {
        if (typeof this.serverConfigs[serverKey] == 'undefined') {
            console.log(this.serverConfigs, this.servers, Object.keys(this));
            console.log(`Cached server configs "${Object.keys(this.serverConfigs).join(', ')}`);
            throw new Error(`Server config "${serverKey}" didn't exist, Available servers "${Object.keys(this.serverConfigs)}"`);
        }

        if (this.serverConfigs[serverKey].conObj != 'object') {
            this.serverConfigs[serverKey].conObj = new(this.getConnection(this.serverConfigs[serverKey].connection))().con;
        }

        return this.serverConfigs[serverKey];
    }

    public static getServiceConfig(serviceControllerKey: string, src?: string): any {
        serviceControllerKey = pascalCase(serviceControllerKey);

        if (typeof this.serviceConfigs[serviceControllerKey] == 'undefined') return false;

        return this.serviceConfigs[serviceControllerKey];
    }

    public static async initDependancyCache(args: CacheDependancyArgsI) {
        await this.cacheAllAuthenticators(args);

        // @Bug - There is an issue here where we are not caching all the controllers properly
        // if (args?.cacheType) {
        //     switch (args?.cacheType) {
        //         case 'websocket':
        //             await this.cacheAllControllerArgs('ws.ts', true);

        //         case 'restful':
        //             await this.cacheAllControllerArgs('rest.ts');
        //     }
        // }

        // await this.cacheServerProps();

        // so i just cached everything till we have more time to look into this
        await this.cacheAllControllerArgs('rest.ts', true);
        await this.cacheAllControllerArgs('ws.ts', true);

        await this.cacheAllConnections(args);
        await this.cacheAllDs(args);
        await this.cacheAllModels(args);
        await this.cacheAllRepos(args);
        await this.cacheFilePaths(args);
    }

    public static getDsPrimitiveConfig(key: string, src: string) {
        if (typeof this.dsPrimitiveConfigs[key] != 'object') {
            throw new Error(`getDsPrimitiveConfig for key "${key}" doesn't exist from src "${src}"`);
        }

        return this.dsPrimitiveConfigs[key];
    }

    public static registerServerConfigs(serverKey: string, configs: any) {
        this.serverConfigs[serverKey] = configs;
    }

    private static async cacheAllControllerArgs(cntExt: string, kill = false) {
        let services = dirFiles(this.projectServicesRoot), service: string;

        for (service of services) {
            const microServicesRoot = `${this.projectServicesRoot}/${service}`;
            let serviceCcKey = pascalCase(service), cont: any;

            // console.log(serviceCcKey);

            if (!fileExists(`${microServicesRoot}/controller.${cntExt}`)) {
                // console.log(`Skipped "${microServicesRoot}/controller.${cntExt}" as file didn't exist"`);
                continue;
            }

            try {
                cont = readFile({
                    path: `${microServicesRoot}/`,
                    file: `controller.${cntExt}`,
                    type: 'text'
                });
            }
            catch (e) {
                console.log(e.message);
                console.log(`Could not read the file: "${microServicesRoot}controller.${cntExt}"`);
                process.exit();
            }

            let matches = cont.replace(/(\r\n|\n|\r|\t)/g, '');

            matches = /@[a-zA-Z0-9]+Controller\((\{.*\})\).*class/gm.exec(matches);

            if (!matches) {
                throw new Error(`Could not cache controller decorator args: ${`${microServicesRoot}/controller.${cntExt}`}`);
            }

            const argsStr = matches[1].replace(/,}/g, '}');

            this.controllerArgs[serviceCcKey] = toObject(argsStr.substr(1, argsStr.length - 2));
        }
    }

    public static getControllerArgs(serviceController: string) {
        if (typeof this.controllerArgs[serviceController] == 'undefined') {
            throw new Error(`ProjectDependancyCaches->getControllerArgs: "${serviceController}" Did not exist`);
        }
        return this.controllerArgs[serviceController];
    }

    public static getControllerArgsForService(serviceKey: string) {
        const cntKey = pascalCase(
            this.controllerArgsRefs[pascalCase(serviceKey.replace(/Service$/, ''))]
        );

        return this.getControllerArgs(cntKey);
    }

    private static async cacheAllModels(args: CacheDependancyArgsI) {
        const modelsPath = `${__dirname}/../../../../src/models`;

        if (!fileExists(modelsPath)) mkdir(modelsPath);

        let models = dirFiles(modelsPath), model: string;

        // cache a default model for all the default datasources in the project
        const dss = Object.values(this.datasources ?? []);

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

    public static async cacheAllAuthenticators(args: CacheDependancyArgsI) {
        let services = dirFiles(this.projectServicesRoot), service: string;

        for (const service of services) {
            if (fileExists(`${this.projectServicesRoot}/${service}/authenticator.ts`)) {
                this.authenticators[pascalCase(service)] = (await import(`services/${service}/authenticator`)).default;
            }
        }
    }

    private static async cacheAllDs(args: CacheDependancyArgsI) {
        const servserPath = `${__dirname}/../../../../src/servers`;

        const dsPath = `${__dirname}/../../../../src/datasources`;

        if (!fileExists(dsPath)) mkdir(dsPath);

        let dss = dirFiles(dsPath),
            ds: string,
            servs = dirFiles(servserPath);

        // first we need to cache all the datasources
        for (ds of dss) {
            const dsKey = ds.replace(/\.ts/, '');
            const d = await import(`datasources/${dsKey}`);

            const className = Object.getPrototypeOf(d.default).name as DEFAUL_BASE_REPO_TYPE;

            const mdi = {
                key: dsKey,
                class: Object.getPrototypeOf(d.default).name,
                // baseType: className.replace('Default', ''),
                baseType: d.default.props.datasourceType,
                isDefault: this._defaultDsTypes.includes(this._dsDescArgs[className].datasourceType),
                type: this._dsDescArgs[className].datasourceType,
                props: this._dsDescArgs[className],
            };

            if (!d.default.metadata) {
                Object.defineProperty(d.default, 'metadata', {
                    value: mdi,
                    writable: false,
                    configurable: false,
                });
            }

            this.datasources[dsKey] = d.default;

            this.dsPrimitiveConfigs[dsKey] = d.default.props;
        }

        let ser: string;

        // Then we need to cache the servers as these are dependancies of "REST" | "WS" types.
        // When we insert a DS on the FE then we will generate a server if we choose a "REST" or "WS" is chosen
        for (ser of servs) {
            const dsKey = ser.replace(/\.ts/, '');

            const s = await import(`${servserPath}/${ser}`);

            this.dsPrimitiveConfigs[dsKey] = s.default.props;
        }
    }

    public static getCachedDs(key: string) {
        if (typeof this.datasources[key] == 'undefined') {
            throw new Error(`PDC.getCachedDs: Datasource: ${key} doesn't exsit`);
        }

        return this.datasources[key];
    }

    private static async cacheFilePaths(args: CacheDependancyArgsI) {
        let services = dirFiles(this.projectServicesRoot), service: string;

        for (service of services) {
            const microServicesRoot = `${this.projectServicesRoot}/${service}`;
            const microServiceDistRoot = `${this.projectServicesDistRoot}/${service}`;
            const serviceCcKey = pascalCase(service);

            // here we neeed to get the config.yaml if one exists
            if (fileExists(`${microServiceDistRoot}/config.yaml`)) {
                try {
                    const yamlConfig = readFile({
                        path: `${microServiceDistRoot}/`,
                        file: 'config.yaml',
                        type: 'yaml'
                    });

                    let cntFileCont = '', cntPathExt: string;

                    if (fileExists(`${microServicesRoot}/controller.rest.ts`)) {
                        cntPathExt = 'rest.ts';
                    }
                    else if (fileExists(`${microServicesRoot}/controller.ws.ts`)) {
                        cntPathExt = 'ws.ts';
                    }

                    if (cntPathExt) {
                        cntFileCont = readFile({
                            path: `${microServicesRoot}/`,
                            file: 'controller.' + cntPathExt,
                            type: 'text'
                        });

                        cntFileCont = cntFileCont.replace(/(\r\n|\n|\r|\t)/g, '');

                        const matches = cntFileCont.match(/class[ ]+([a-zA-Z0-9_]+)/);

                        if (!matches[1]) {
                            throw new Error(`Could not link service to controller class name for: "${JSON.stringify(yamlConfig, null, 4)}"`);
                        }

                        const cntName = matches[1];

                        try {
                            const controllerArgs = this.getControllerArgs(cntName.replace(/Controller$/, ''));

                            yamlConfig.serviceController = {
                                name: cntName,
                                ...controllerArgs,
                            };
                        }
                        catch (e) {
                            args.logger.warnI('There might be a bug here where we also need to cache the WS controllers websocket args also');
                            args.logger.warnI(`Couldn't cache controller name for "${cntName}"`);
                            console.log(e);
                            // args.logger.errorI(e, 'ProjectDependancyCaches: cacheFilePaths: catch');

                            process.exit();
                        }
                    }

                    this.serviceConfigs[serviceCcKey] = yamlConfig;
                }
                catch (e) {
                    console.log(`Critical: Couldn't cache config file for "${serviceCcKey}"`);
                    process.exit();
                }
            }

            let microServices = dirDirectories(microServicesRoot), microService: string;

            for (microService of microServices) {
                const microservicePath = `${microServicesRoot}/${microService}`;

                const msKey = pascalCase(microService);
                const fileDependancies: any = { key: msKey };

                if (fileExists(`${microservicePath}/action.ts`)) {
                    const servicecPath = `services/${service}/${microService}`;

                    fileDependancies.service = {
                        service,
                        microService,
                        key: msKey,
                        path: servicecPath,
                    };
                    this.filePaths.services[msKey] = fileDependancies.service;
                    // we need to set this as we need to have a reference of what services are
                    // in what controller / service
                    this.controllerArgsRefs[msKey] = service;
                }

                if (fileExists(`${microservicePath}/action.ts`)) {
                    const actionPath = `services/${service}/${microService}`;

                    fileDependancies.action = {
                        service,
                        microService,
                        key: msKey + 'Action',
                        path: actionPath,
                    };

                    this.filePaths.actions[msKey + 'Action'] = fileDependancies.action;
                }

                if (fileExists(`${microservicePath}/model.ts`)) {
                    const modelActionPath = `services/${service}/${microService}/model`;

                    fileDependancies.modelAction = {
                        service,
                        microService,
                        key: msKey + 'ModelAction',
                        path: modelActionPath,
                    };

                    this.filePaths.modelActions[msKey + 'ModelAction'] = fileDependancies.modelAction;
                    this.filePaths.actions[msKey + 'Action'].modelAction = fileDependancies.modelAction;
                }

                if (fileExists(`${microservicePath}/input.ts`)) {
                    const actionInputPath = `services/${service}/${microService}/input`;

                    fileDependancies.actionInput = {
                        service,
                        microService,
                        key: msKey + 'ActionInput',
                        path: actionInputPath,
                    };

                    this.filePaths.actionInputs[msKey + 'ActionInput'] = fileDependancies.actionInput;
                }

                this.filePaths.servicesDeps[msKey] = fileDependancies;

                if (msKey + 'ActionInput' == 'DeleteDatasourceTypeActionInput') {
                    console.log('YUP GETTING TO HERE');
                    process.exit();
                }
            }
        }
    }

    public static getCachedMicroServiceProps(key: string) {
        key = pascalCase(key);

        if (typeof this.filePaths.servicesDeps[key] == 'undefined') {
            // console.log('servicesDeps: ', key, ' : ', this.filePaths.servicesDeps);
            throw new Error(`Micro Service cache props: "${key}" was undefined`);
        }

        return this.filePaths.servicesDeps[key];
    }

    public static getCachedActionProps(key: string) {
        if (typeof this.filePaths.actions[key] == 'undefined') {
            throw new Error(`Action cache props: "${key}" was undefined`);
        }

        return this.filePaths.actions[key];
    }

    public static getCachedModelActionProps(key: string) {
        if (typeof this.filePaths.modelActions[key] == 'undefined') {
            throw new Error(`Model Action cache props: "${key}" was undefined`);
        }

        return this.filePaths.modelActions[key];
    }

    public static getCachedActionInputProps(key: string) {
        if (typeof this.filePaths.actionInputs[key] == 'undefined') {
            throw new Error(`Action Inputs cache props: "${key}" was undefined`);
        }

        return this.filePaths.actionInputs[key];
    }

    public static getCachedServiceFile(msKey: string, service: string) {
        if (!this.filePaths.services?.[ucFirst(service ?? '')]) {
            throw ``;
        }
        return this.filePaths.services[ucFirst(service)];
    }

    private static async cacheAllConnections(args: CacheDependancyArgsI) {
        const connectionFiles = dirFiles(`${__dirname}/../../../../src/connections`);

        for (const con of connectionFiles) {
            const conKey = con.replace(/\.ts/, '');
            const c = await import(`${__dirname}/../../../../src/connections/${conKey}`);

            this.connections[pascalCase(conKey)] = c.default;

            if (typeof c.default == 'undefined') {
                console.log(`CRITICAL: "connections/${conKey}" didn't have a default export. Please make sure you have declared your connection class with the "export 'default'" included`);
                process.exit();
            }
        }
    }

    private static async cacheAllRepos(args: CacheDependancyArgsI) {
        let repoDsType: string,
            repo: string;
        
        const resposPath = `${__dirname}/../../../src/repos`;

        if (!fileExists(resposPath)) mkdir(resposPath);

        let repoTypes = dirFiles(resposPath);;

        const dss = Object.values(this.datasources ?? []);

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
                    args.logger
                );

                // console.log('COOKE: ', ds.metadata, this.repos);
            }
        }

        // loop through all the repos that exist in the project
        for (repoDsType of repoTypes) {
            const repos = dirFiles(`${__dirname}/../../../src/repos/${repoDsType}`, '.js');

            for (repo of repos) {
                repo = repo.substring(0, repo.length - 3);

                const defRepo = await import(`repos/${repoDsType}/${repo}`);

                this.cacheRepo(
                    repoDsType,
                    repo,
                    defRepo.default,
                    args.logger
                );
            }
        }
    }

    public static cacheConnection(key: string, connection: any) {
        this.connectionsIns[key] = connection;
    }

    public static getConnectionIns(key: string) {
        if (typeof this.connectionsIns[key] == 'undefined') {
            throw new Error(`Connection instance of key "${key}" does not exist`);
        }
        return this.connectionsIns[key];
    }

    private static cacheModel(key: string, model: any) {
        model.logger = getLogger();
        this.models[key] = model;
    }

    private static cacheRepo(dsType: string, repoName: string, repo: any, logger: Logger) {
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
            repo.ds = (new (this.datasources[kebabCase(repoProps.datasource)])).ds;

            this.repos[`${pascalCase(dsType)}.${pascalCase(repoName.replace(/Model$/, 'Repo'))}`] = repo;
        }
        catch (e) {
            console.log('\n\n');
            console.log(`ProjectDependancyCaches.cacheRepo: CRITICAL ERROR CACHING REPO. Error: ${e.message}`);
            console.log(`Looking for "${pascalCase(dsType)}.${pascalCase(repoName)}"`);
            console.log('dsType: ', dsType);
            console.log('repoName: ', repoName);
            console.log('repo: ', repo);
            console.log('\n');
            console.log('Datasources: ', kebabCase(repoProps.datasource), ' : ', this.datasources);
            console.log(e);
            console.log('\n\n');
            process.exit();
        }
    }

    public static getEntity(entityKey: string) {
        entityKey = `${entityKey.replace(/Model$/, '')}Model`;

        if (typeof this.models[entityKey] == 'undefined') {
            console.log('this.models: ', entityKey, ' : ', Object.keys(this.models));
            throw new Error(`Model with key: "${entityKey}" did not exist`);
        }

        return this.models[entityKey];
    }

    public static convertStringToRepoKey(repoKey: string) {
        repoKey = `${(repoKey + '').replace(/Model$/, '').replace(/Repo$/, '')}Repo`;

        // if the word "Repo" isn't appended to the back of the word then append it
        if (!/Repo$/.test((repoKey + ''))) repoKey = `${repoKey}Repo`;

        return repoKey;
    }

    public static getRepo(repoKey: string, src?: string) {
        const key = this.convertStringToRepoKey(repoKey);

        if (typeof this.repos[key] == 'undefined') {
            console.log('repos: ', src, ' : ', key, Object.keys(this.repos).join('\n'));
            throw new Error(`Repo with key: "${key}" did not exist`);
        }

        return this.repos[key];
    }

    public static getConnection(connectionKey: string, src?: string) {

        if (typeof this.connections[connectionKey] == 'undefined') {
            console.log('connection: ', src, ' : ', connectionKey, this.connections);
            throw new Error(`Connection with key: "${connectionKey}" did not exist`);
        }

        return this.connections[connectionKey];
    }
}