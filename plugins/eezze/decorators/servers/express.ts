import { dirFiles, fileExists, readFile } from '../../libs/FileMethods';
import { EezzeRouter, Logger } from '../../classes';
import { setLogger } from '../..';
import { kebabCase, pascalCase } from '../../libs/StringMethods';
import PDC from '../../classes/ProjectDependancyCaches';
import { StaticFolder } from '../../classes/ExpressApp';

interface RestServerArgsI {
    logger: Logger;
    connection: string;
    host?: string;
    port?: number;
    staticFolders?: StaticFolder[];
    healthCheckPort: number | string;

    devIsSecure?: boolean;
    secure?: boolean;
    protocol?: string;
    secureProtocol?: string;
    localhost?: string;
    ip?: string;
    path?: string;

    storeState?: boolean;
    storeStateInterval?: number;
}

export function ExpressServer(serverArgs: RestServerArgsI) {
    setLogger(serverArgs.logger);

    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        PDC.registerServerConfigs(kebabCase(constructor.name), serverArgs);

        Object.defineProperty(constructor, 'props', {
            value: {
                ...serverArgs,
                class: constructor.name,
                key: kebabCase(constructor.name),
            },
            writable: false,
        });

        return class ExtendedRestServer extends constructor {
            erouter: any;

            async includeAllControllers() {
                const distRoot = `${__dirname}/../../../../src/services`,
                      srcRoot = `${__dirname}/../../../../../src/services`,
                      services: string[] = dirFiles(srcRoot);

                for (const service of services) {
                    const serviceConfig: any = PDC.getServiceConfig(service);

                    if (!serviceConfig?.serviceController?.server) continue;

                    const serviceContServer = pascalCase(serviceConfig?.serviceController?.server);

                    if (serviceContServer != constructor.name) {
                        // console.log('SKIPPED CONTROLLER: ', serviceContServer, ' : ', constructor.name);
                        continue;
                    }

                    // here we might have to include everything into the app for registering the service
                    // cache information. This will be temporary until we can clean this up and optimize
                    // the plugin code
                    if (fileExists(`${distRoot}/${service}/controller.rest.js`)) {
                        const controller = (await import(`services/${service}/controller.rest`)).default;
                        new controller({ serviceConfig });

                        controller.logger = serverArgs.logger;
                    }
                }
            }

            async run(runServer: boolean = true) {
                await PDC.initDependancyCache({
                    logger: serverArgs.logger,
                    cacheType: 'restful'
                });

                let connection;

                try {
                    connection = PDC.getConnectionIns(serverArgs.connection);
                }
                catch (err) {
                    throw new Error(`Err2: Connection: ${serverArgs.connection}, initialization error: ${err.message}`);
                }

                const serviceController = kebabCase(constructor.name);

                this.erouter = new EezzeRouter({
                    logger: serverArgs.logger,
                    staticFolders: serverArgs?.staticFolders ?? []
                }, 'express');

                PDC.registerServer(serviceController, this);

                await this.includeAllControllers();

                const cd = connection.serialize();

                let host = cd.local,
                    port = cd.port ?? 1000,
                    healthCheckPort = serverArgs.healthCheckPort;

                if (typeof serverArgs?.host == 'string') {
                    host = serverArgs?.host;
                }

                if (typeof serverArgs?.port == 'number') {
                    port = serverArgs?.port;
                }

                if (typeof healthCheckPort == 'string') {
                    healthCheckPort = Number(healthCheckPort);
                }

                if (runServer) {
                    this.erouter.router.start({
                        host,
                        port,
                        healthCheckPort,
                    });
                }
            }
        }
    }
}