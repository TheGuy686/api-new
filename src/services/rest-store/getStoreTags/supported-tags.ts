const dict = {
	'd-con-name': 'Default Server',
	'd-con-desc': 'The default server that all dependencies will be installed on',
	'd-ds-db-name': 'Default Database',
	'd-ds-db-desc': 'This is the default database that will be used to store all the website data.',
	'd-ds-rest-name': 'Default Rest Service',
	'd-ds-rest-desc': 'This is the default service that will be used to serve all REST requests to the supplied connection',
	'd-ds-ws-name': 'Default Websocket Service',
	'd-ds-ws-desc': 'This is the default service that will be used to serve all Websocket requests to the supplied connection',
	'd-sg-auth-name': 'Default Website Authenticator',
	'd-sg-auth-desc': 'This is the default authenticator that will be used through out the website services to authenticate access to any of the provided endpoints, websocket\'s or other dependencies',
	'd-vault-name': 'Default Vault',
	'd-vault-desc': 'This is the default credentials vault that will store all secret values',
	'd-email-service-name': 'Email Service Correspondent',
	'd-email-service-desc': 'This is the service group that will be responsible for doing all the communication with the third party service and the relaying responses back to the client.',
	'd-cus-email-service-name': 'Custom Email Service',
	'd-cus-email-service-desc': 'Custom email service description.',
	'd-ds-file-storage-name': 'Default File Storage',
	'd-ds-file-storage-desc': 'This is the default file storage that will be used as a network drive between the docker images and will store all file assets',
	'd-sg-rest-name': 'Default Rest Service Group',
	'd-sg-rest-desc': 'This is the service group that will be used by default for all rest services when there is no grouping tag (SG Name) provided',
	'd-sg-ws-name': 'Default Websocket Service Group',
	'd-sg-ws-desc': 'This is the service group that will be used by default for all ws services when there is no grouping tag (SG Name) provided',
	'd-sg-cron-name': 'Default Cron Service Group',
	'd-sg-cron-desc': 'This is the service group that will be used by default for all cron services when there is no grouping tag (SG Name) provided',
	'd-value-store-name': 'Default Value Store',
	'd-value-store-desc': 'This is where all the values will be stored that need to be globally accessible to the application. This is essentially the values that will be output to the .env file',
	'd-social-authenticator-name': '$1 Authenticator Correspondent',
	'd-social-authenticator-desc': 'This is the service group that will encapsulate all the services that will be responsible for authenticating with $1',
	'd-social-authenticator-tpi-name': '$1 Login API Integration',
	'd-social-authenticator-tpi-desc': 'This is the third party REST API integration that will do all the correspondence to the $1 API\'s',
}

interface AI_RES_QU_ANS {
	tag: string;
	todos: string[];
	prompts: string[];
}

interface AI_RES_QU {
	tag: string;
	qu: string;
	answers: {
		manual?: AI_RES_QU_ANS,
		store?: AI_RES_QU_ANS,
	};
}

export interface FULL_RES_ITEM {
	tag: string;
	questions: AI_RES_QU[];
}

interface AI_RES {
	[key: string | symbol]: FULL_RES_ITEM;
}

const cc = function (name: string, desc: string) {
    return `create:con:eezze:${name}:${desc}`;
}

const cds = function (name: string, desc: string, type: string) {
    return `create:ds:${type}:${name}:${desc}`;
}

// create ds third party integration
const cdstpi = function (name: string, desc: string, type: string = 'rest') {
    return cds(name, desc, `${type}-api-integration`);
}

// create service group prompt
const csg = function (name: string, des: string, type: string = 'custom') {
    return `create:sg:custom:${name}:${des}`;
}

// create credentials vault prompt
const ccv = function (name: string, des: string) {
    return `create:cv:${name}:${des}`;
}

// create credentials vault value
const ccvv = function (vault: string, name: string, des: string) {
    return `create:cvv:${vault}:${name}:${des}`;
}

// create value store prompt
const cvs = function (name: string, des: string) {
    return `create:vs:${name}:${des}`;
}

// default todo's
const tdAddConCreds = 'add-con-creds-to-vault';
const tdCreateAppCreds = 'create-app-creds';

// response prompts
const queryStore: any = 'store';

const defConName = dict['d-con-name'];
const defDsDbName = dict['d-ds-db-name'];
const defDsRestName = dict['d-ds-rest-name'];
const defDsWsName = dict['d-ds-ws-name'];
const defDsFsName = dict['d-ds-file-storage-name'];
const defSiteAuthName = dict['d-sg-auth-name'];
const defVaultName = dict['d-vault-name'];
const defValStoreName = dict['d-value-store-name'];

// dependency create prompt defaults
const defCon = cc(defConName, dict['d-con-desc']);
const defDb = cds(defDsDbName, dict['d-ds-db-desc'], 'Mysql');
const defRest = cds(defDsRestName, dict['d-ds-rest-desc'], 'rest-service' );
const defFs = cds(defDsFsName, dict['d-ds-file-storage-desc'], 'FileStorage' );
const defWs = cds(defDsWsName, dict['d-ds-ws-desc'], 'websocket-service' );
const defAuth = csg(defSiteAuthName, dict['d-sg-auth-desc'], 'authenticator');
const defCredsVault = ccv(defVaultName, dict['d-vault-desc']);
const defValueStore = cvs(defValStoreName, dict['d-value-store-desc']);

// default service groups
const defRestSg = csg(dict['d-sg-rest-name'], dict['d-sg-rest-desc']);
const defWsSg = csg(dict['d-sg-ws-name'], dict['d-sg-ws-desc']);
const defCronSg = csg(dict['d-sg-cron-name'], dict['d-sg-cron-desc']);

// todo prompt defaults

const tdCreateEnts = 'create-ds-entities';
const tdCreateServs = 'create-services';
const tdCreateAthServs = 'create-auth-services';
const tdAddApiCreds = 'add-tp-credential-dependencies:$1';
const tdAddDbCreds = 'add-credential-dependencies-for-ds-db';
const tdAddTpApiInfo = 'add-third-party-api-creds-for';

const emailDefs: {[key: string | symbol]: AI_RES_QU_ANS} = {
    emailService: {
        tag: 'email-service',
        todos: [
            tdAddConCreds,
            // we'll need entities because for something like an emailing system
            // we would assume that the website will also need an authentication
            // system and then this will also require auth endpoints and other
            // endpoints within the services to will do all the correspondence
            // to the third party API and then responses back on the website
            tdCreateEnts,
            tdCreateServs,
            tdCreateAthServs,
            // Here the user will need to set the credentials in the vault that will
            // be used to connect to the chosen third party email service
            tdAddApiCreds,
            tdAddDbCreds,
        ],
        prompts: [
            // connection
            defCon,
            // creds vault
            defCredsVault,
            defValueStore,
            // datasources
            defDb,
            defRest,
            // service group
            defAuth,
            csg(dict['d-email-service-name'], dict['d-email-service-desc']),
        ],
    },
    cusEmailService: {
        tag: 'custom-emailing-service',
        todos: [
            tdAddConCreds,
            // we'll need entities because for something like an emailing system
            // we would assume that the website will also need an authentication
            // system and then this will also require auth endpoints and other
            // endpoints within the services to will do all the correspondence
            // to the third party API and then responses back on the website
            tdCreateEnts,
            tdCreateServs,
            tdCreateAthServs,
            tdAddDbCreds,
        ],
        prompts: [
            // connection
            defCon,
            // creds vault
            defCredsVault,
            // values store
            defValueStore,
            // datasources
            defDb,
            defFs,
            defRest,
            //service groups
            defAuth,
            csg(dict['d-cus-email-service-name'], dict['d-cus-email-service-desc']),
        ],
    },
}

const fullServices: AI_RES = {
    cusEmailService: {
        tag: 'custom-emailing-service',
        questions: [
            {
                tag: 'custom-emailing-service',
                qu: 'who-will-create-this-qu',
                answers: {
                    manual: emailDefs.cusEmailService,
                    store: {
                        tag: 'custom-emailing-service',
                        todos: [
                            tdAddConCreds,
                            tdAddApiCreds,
                        ],
                        prompts: [ queryStore ],
                    },
                }
            },
        ],
    },
    emailService: {
        tag: 'email-service',
        questions: [
            {
                tag: 'email-service',
                qu: 'who-will-create-this-qu',
                answers: {
                    manual: emailDefs.emailService,
                    store: {
                        tag: 'email-service',
                        todos: [ tdAddConCreds, tdAddApiCreds ],
                        prompts: [ queryStore ],
                    },
                }
            },
        ],
    }
}

const questionDefs : {[key: string | symbol]: AI_RES_QU} = {
    siteNeedDbQu: {
        tag: 'database',
        qu: 'site-need-db-qu',
        answers: {
            manual: {
                tag: 'database',
                todos: [ tdAddConCreds, tdAddDbCreds ],
                prompts: [ defCon, defDb, defCredsVault ],
            },
            store: {
                tag: 'database',
                todos: [ tdAddDbCreds ],
                prompts: [ queryStore ],
            }
        }
    },
    siteNeedToBeAccessibleQu: {
        tag: 'basic-site-scaffold',
        qu: 'site-need-to-be-accessible-qu',
        answers: {
            manual: {
                tag: 'basic-site-scaffold',
                todos: [ tdAddConCreds ],
                prompts: [
                    // connection
                    defCon,
                    // value store and creds valut
                    defValueStore,
                    defCredsVault,
                    // datasources
                    defRest,
                    defWs,
                    // service groups
                    defRestSg,
                    defWsSg,
                    defCronSg,
                ],
            },
            store: {
                tag: 'basic-site-scaffold',
                todos: [ tdAddConCreds],
                prompts: [ queryStore ],
            },
        },
    },
    siteNeedsToSendEmails: {
        tag: 'email-service',
        qu: 'site-need-to-send-emails-qu',
        answers: {
            manual: emailDefs.emailService,
            store: {
                tag: 'email-service',
                todos: [ tdAddConCreds ],
                prompts: [ queryStore ],
            },
        },
    },
    siteNeedsFileStorage: {
        tag: 'file-storage',
        qu: 'site-need-file-storage-qu',
        answers: {
            manual: {
                tag: 'file-storage',
                todos: [
                    tdAddConCreds,
                    tdCreateServs,
                ],
                prompts: [
                    // connection
                    defCon,
                    // values store and creds vault
                    defCredsVault,
                    defValueStore,
                    // datasources
                    defFs,
                    defRest,
                    defWs,
                    defCronSg,
                ],
            },
            store: {
                tag: 'file-storage',
                todos: [ tdAddConCreds ],
                prompts: [ queryStore ],
            },
        },
    },
    siteNeedToCommunicateOutsideQu: {
        tag: 'basic-site-with-tp-apis-scaffold',
        qu: 'site-need-to-communicate-outside-qu',
        answers: {
            manual: {
                tag: 'basic-site-with-tp-apis-scaffold',
                todos: [ tdAddConCreds, tdAddTpApiInfo ],
                prompts: [
                    // connection
                    defCon,
                    // values store and creds vault
                    defCredsVault,
                    defValueStore,
                    // datasources
                    defRest,
                    defWs,
                    // service groups
                    defRestSg,
                    defWsSg,
                    defCronSg,
                ],
            },
            store: {
                tag: 'basic-site-with-tp-apis-scaffold',
                todos: [ tdAddConCreds, tdAddTpApiInfo ],
                prompts: [ queryStore ],
            },
        },
    },
};

// add blog

const plainKwsTypes: AI_RES = {
    // we will automatically assume lots of work and
    // return a list of questions and dependencies
    'custom': {
        tag: 'custom',
        questions: Object.values(questionDefs),
    },
    'local-database': {
        tag: 'database',
        questions: [
            {
                tag: 'database',
                qu: 'who-will-create-this-qu',
                answers: {
                    manual: {
                        tag: 'database',
                        todos: [
                            tdAddConCreds,
                            tdAddDbCreds,
                        ],
                        prompts: [
                            // connection
                            defCon,
                            // creds vault
                            defCredsVault,
                            // create ds
                            defDb,
                        ],
                    },
                    store: {
                        tag: 'database',
                        todos: [ tdAddConCreds, tdAddDbCreds ],
                        prompts: [ queryStore ],
                    }
                }
            },
        ],
    },
    'user-emailing-system': fullServices.cusEmailService,
    'custom-email-service': fullServices.cusEmailService,
    'custom-built-email-service': fullServices.cusEmailService,
    'email-service': fullServices.emailService,
    'emailing-service': fullServices.emailService,
    'third-party-email-service': fullServices.emailService,
}

const regTypes: AI_RES = {
    '([a-zA-Z0-9_]+)-login': {
        tag: '$1-login',
        questions: [
            {
                tag: '$1-login',
                qu: 'who-will-create-this-qu',
                answers: {
                    manual: {
                        tag: '$1-login',
                        todos: [
                            // we will need to have the services configured to provide
                            // the endpoints to serve the authentication requests
                            tdCreateServs,
                            tdCreateAppCreds,
                        ],
                        prompts: [
                            // connection
                            defCon,
                            // creds vault and value store
                            defCredsVault,
                            defValueStore,
                            // datasources
                            defRest,
                            // service groups
                            cdstpi(dict['d-social-authenticator-tpi-name'], dict['d-social-authenticator-tpi-desc']),
                            csg(dict['d-social-authenticator-name'], dict['d-social-authenticator-desc'], 'authenticator'),
                        ],
                    },
                    store: {
                        tag: '$1-login',
                        todos: [
                            tdAddConCreds,
                            tdAddApiCreds,
                            tdCreateAppCreds,
                        ],
                        prompts: [ queryStore ],
                    },
                }
            },
        ],
    },
}

export default function () {
    return {
        defaults: {
            todos: {
                tdAddConCreds,
            },
            prompts: {
                queryStore,
            }
        },
        plainKwsTypes: plainKwsTypes,
        regTypes: regTypes,
        keywords: [
            ...Object.keys(plainKwsTypes),
            ...Object.keys(regTypes),
        ],
    }
};