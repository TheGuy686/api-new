export interface DSArgsI {
    // these are all the required args for the ds
    connection?: string;
	datasourceType: string;
	includeDatabase?: boolean;

    // These are all the args that need to be settable from both the connection and
    // on the DS level. This is because we might have a server where everything accross the board
    // must use the same settings. But if there is a server which has one static IP and then
    // we have other independant services like "mysql", a "ws server" etc then each of these uses
    // different ports and settings that has to be configurable from both levels
    devIsSecure?: boolean;
    secure?: boolean;
    protocol?: string;
    secureProtocol?: string;
    localhost?: string;
    ip?: string;
    port?: number | string;
    host?: string;
    alias?: string;

    storeState?: boolean;
    storeStateInterval?: number;
    path?: string;

    // MYSQL Type Args
    databaseName?: string;

    // File Storage type
    rootPath?: E_CM_CB_STR | string;
    fileType?: string;

    // REST and WS Integration Types
    headers?: { [key: string]: any };
    payload?: { [key: string]: any };

    // Generaic types applicabile accross the board
    user?: string;
    password?: string;
};