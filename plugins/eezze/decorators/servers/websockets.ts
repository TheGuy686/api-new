import { dirFiles, fileExists, readFile } from '../../libs/FileMethods';
import { ActionDataManager, Logger, LogicChain } from '../../classes';
import { EWebSocket } from '../../classes/EWebSocket';
import { setLogger } from '../..';
import { kebabCase } from '../../libs/StringMethods';
import PDC from '../../classes/ProjectDependancyCaches';

interface WsServerArgsI {
    connection: string;
    logger: Logger;
    authenticator?: string;

    devIsSecure?: boolean;
    secure?: boolean;
    protocol?: string;
    secureProtocol?: string;
    localhost?: string;
    ip?: string;
    port?: number | string;
    host?: string;
    path?: string;
    healthCheckPort: number | string;

    trustedOrigins?: string[];

    storeState?: boolean;
    storeStateInterval?: number;

    connectionId?: E_CM_CB_STR;
}

export function WSServer(wsArgs: WsServerArgsI) {
    setLogger(wsArgs.logger);

    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        PDC.registerServerConfigs(kebabCase(constructor.name), wsArgs);

        Object.defineProperty(constructor, 'props', {
            value: {
                ...wsArgs,
                class: constructor.name,
                key: kebabCase(constructor.name),
            },
            writable: false,
        });

        return class ExtendedWsServer extends constructor {
            socket: EWebSocket;

            public get state() { return this.socket.state }

            async includeAllControllers(serverName: string) {
                const distRoot = `${__dirname}/../../../../src/services`,
                      srcRoot = `${__dirname}/../../../../../src/services`,
                      services: string[] = dirFiles(srcRoot);

                for (const service of services) {
                    const serviceConfig = PDC.getServiceConfig(service);

                    if (typeof serviceConfig === 'boolean' || !serviceConfig?.serviceController) {
                        throw new Error(`Serviceconfig does not exist in cache for service ${service}`);
                    }

                    const serviceController: any = serviceConfig.serviceController;

                    /**
                     * Only add services that have a service controller object and are from the same server (servername)
                     */
                    if (fileExists(`${distRoot}/${service}/controller.ws.js`)
                        && typeof serviceController !== 'undefined'
                        && serviceController.server === serverName
                    ) {
                        const controller = (await import(`services/${service}/controller.ws`)).default;
                        new controller({
                            serviceConfig
                        });

                        controller.logger = wsArgs.logger;
                    }
                }
            }

            async run(runServer: boolean = true) {
                await PDC.initDependancyCache({
                    logger: wsArgs.logger,
                    cacheType: 'websocket',
                });

                let connection;

                try {
                    connection = PDC.getConnectionIns(wsArgs.connection);
                }
                catch (err) {
                    throw `Err4: Connection: ${wsArgs.connection}, initialization error: ${err.message}`;
                }

                let auth: any;

                if (wsArgs?.authenticator) {
                    auth = PDC.getAuthenticator(wsArgs?.authenticator);
                }

                const isDev = connection.isDev;
                const devIsSecure = wsArgs?.devIsSecure ?? connection.devIsSecure;
                const secure = wsArgs?.secure ?? connection?.secure ?? false;

                const secureProtocol = wsArgs?.secureProtocol ?? connection?.secureProtocol ?? 'wws';
                const protocol = wsArgs?.protocol ?? 'ws';

                // let protocolI;

                // // first default to the passed in protocol from the DS file if provided
                // if (typeof wsArgs?.protocol == 'string') {
                //     protocolI = wsArgs?.protocol;
                // }
                // // set the protocol to secure if we're in dev and the user wants to use secure communication on development
                // else if (isDev && devIsSecure) {
                //     protocolI = secureProtocol;
                // }
                // // then we need to set the protocol to secure if the secure boolean is provided on the connection level or on the ds level
                // else if (!isDev && secure) {
                //     protocolI = secureProtocol;
                // }
                // else {
                //     protocolI = protocol;
                // }

                let isSecure = false;

                if (isDev) {
                    if (typeof wsArgs?.devIsSecure == 'boolean') {
                        isSecure = wsArgs?.devIsSecure;
                    }
                    else if (typeof connection?.devIsSecure == 'boolean') {
                        isSecure = connection?.devIsSecure;
                    }
                }
                else {
                    if (typeof wsArgs?.secure == 'boolean') {
                        isSecure = wsArgs?.secure;
                    }
                    else if (typeof connection?.secure == 'boolean') {
                        isSecure = connection?.secure;
                    }
                }

                const cd = connection.serialize();

                let host = cd.local, port = cd.port ?? 1100;

                if (typeof wsArgs?.host == 'string') {
                    host = wsArgs?.host;
                }

                if (typeof wsArgs?.port == 'number') {
                    port = wsArgs?.port;
                }
                else if (typeof wsArgs?.port == 'string' && wsArgs?.port != '') {
                    port = Number(wsArgs?.port);
                }

                let healthCheckPort: number | string = wsArgs.healthCheckPort;

                const storeStateConfig: any = {};

                if (wsArgs?.storeState) {
                    storeStateConfig.storeState = true;
                    storeStateConfig.interval = 500;
                }

                if (wsArgs.logger.hasLogger) {
                    const dsConfig = PDC.getDsPrimitiveConfig(wsArgs.logger.logServer, 'WSServer');

                    let loggerConnection;

                    try {
                        loggerConnection = PDC.getConnectionIns(dsConfig.connection);
                    }
                    catch (err) {
                        throw new Error(`Err5: Connection: ${dsConfig.connection}, initialization error: ${err.message}`);
                    }

                    wsArgs.logger.connectToLoggingServer(loggerConnection, dsConfig.port, dsConfig.path);
                }

                if (typeof healthCheckPort == 'string') {
                    healthCheckPort = Number(healthCheckPort);
                }

                storeStateConfig['healthCheckPort'] = healthCheckPort;

                this.socket = new EWebSocket(
                    connection,
                    auth,
                    wsArgs?.connectionId,
                    storeStateConfig
                );

                PDC.registerServer(kebabCase(constructor.name), this);

                await this.includeAllControllers(kebabCase(constructor.name));

                if (runServer) this.socket.connect({
                    logger: wsArgs.logger,
                    secure: isSecure,
                    host: `${host}`,
                    port,
                    initStateEvents: wsArgs?.storeState,
                });

                // PDC.registerServer(kebabCase(constructor.name), this);
                // let serviceController = kebabCase(constructor.name);
            }
        }
    }
}

export function WSLoggingServer(wsArgs: WsServerArgsI) {
    setLogger(wsArgs.logger);

    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        PDC.registerServerConfigs(kebabCase(constructor.name), wsArgs);

        Object.defineProperty(constructor, 'props', {
            value: {
                ...wsArgs,
                class: constructor.name,
                key: kebabCase(constructor.name),
            },
            writable: false,
        });

        return class ExtendedWsServer extends constructor {
            socket: EWebSocket;

            public get state() { return this.socket.state }

            async includeAllControllers(serverName: string) {
                const distRoot = `${__dirname}/../../../../src/services`,
                      srcRoot = `${__dirname}/../../../../../src/services`,
                      services: string[] = dirFiles(srcRoot);

                for (const service of services) {
                    const serviceConfig = PDC.getServiceConfig(service);

                    if (typeof serviceConfig === 'boolean') {
                        throw `Serviceconfig does not exist in cache for service ${service}`;
                    }

                    const serviceController: any = serviceConfig.serviceController;

                    /**
                     * Only add services that have a service controller object and are from the same server (servername)
                     */
                    if (fileExists(`${distRoot}/${service}/controller.ws.js`)
                        && typeof serviceController !== 'undefined'
                        && serviceController.server === serverName
                    ) {
                        const controller = (await import(`services/${service}/controller.ws`)).default;
                        new controller({
                            serviceConfig
                        });

                        controller.logger = wsArgs.logger;
                    }
                }
            }

            async run(runServer: boolean = true) {
                await PDC.initDependancyCache({
                    logger: wsArgs.logger,
                    cacheType: 'websocket',
                });

                let connection;

                try {
                    connection = PDC.getConnectionIns(wsArgs.connection);
                }
                catch (err) {
                    throw new Error(`Err5: Connection: ${wsArgs.connection}, initialization error: ${err.message}`);
                }

                let auth: any;

                if (wsArgs?.authenticator) {
                    auth = PDC.getAuthenticator(
                        wsArgs?.authenticator
                    );
                }

                const isDev = connection.isDev;
                const devIsSecure = wsArgs?.devIsSecure ?? connection.devIsSecure;
                const secure = wsArgs?.secure ?? connection?.secure ?? false;

                const secureProtocol = wsArgs?.secureProtocol ?? connection?.secureProtocol ?? 'wws';
                const protocol = wsArgs?.protocol ?? 'ws';

                // let protocolI;

                // // first default to the passed in protocol from the DS file if provided
                // if (typeof wsArgs?.protocol == 'string') {
                //     protocolI = wsArgs?.protocol;
                // }
                // // set the protocol to secure if we're in dev and the user wants to use secure communication on development
                // else if (isDev && devIsSecure) {
                //     protocolI = secureProtocol;
                // }
                // // then we need to set the protocol to secure if the secure boolean is provided on the connection level or on the ds level
                // else if (!isDev && secure) {
                //     protocolI = secureProtocol;
                // }
                // else {
                //     protocolI = protocol;
                // }

                let isSecure = false;

                if (isDev) {
                    if (typeof wsArgs?.devIsSecure == 'boolean') {
                        isSecure = wsArgs?.devIsSecure;
                    }
                    else if (typeof connection?.devIsSecure == 'boolean') {
                        isSecure = connection?.devIsSecure;
                    }
                }
                else {
                    if (typeof wsArgs?.secure == 'boolean') {
                        isSecure = wsArgs?.secure;
                    }
                    else if (typeof connection?.secure == 'boolean') {
                        isSecure = connection?.secure;
                    }
                }

                const cd = connection.serialize();

                let host = cd.local, port = cd.port ?? 1100;

                if (typeof wsArgs?.host == 'string') {
                    host = wsArgs?.host;
                }

                if (typeof wsArgs?.port == 'number') {
                    port = wsArgs?.port;
                }
                else if (typeof wsArgs?.port == 'string' && wsArgs?.port != '') {
                    port = Number(wsArgs?.port);
                }

                const storeStateConfig: any = {};

                if (wsArgs?.storeState) {
                    storeStateConfig.storeState = true;
                    storeStateConfig.interval = 500;
                }

                let healthCheckPort: number | string = wsArgs.healthCheckPort;

                if (typeof healthCheckPort == 'string') {
                    healthCheckPort = Number(healthCheckPort);
                }

                storeStateConfig['healthCheckPort'] = healthCheckPort;

                this.socket = new EWebSocket(
                    connection,
                    auth,
                    wsArgs?.connectionId,
                    storeStateConfig,
                    wsArgs?.trustedOrigins
                );

                PDC.registerServer(kebabCase(constructor.name), this);

                await this.includeAllControllers(kebabCase(constructor.name));

                if (runServer) this.socket.connect({
                    logger: wsArgs.logger,
                    secure: isSecure,
                    host: `${host}`,
                    port,
                    initStateEvents: wsArgs?.storeState,
                });

                // PDC.registerServer(kebabCase(constructor.name), this);
                // let serviceController = kebabCase(constructor.name);
            }
        }
    }
}