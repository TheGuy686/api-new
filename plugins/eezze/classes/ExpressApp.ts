import express from 'express';
import Logger from './Logger';
import EezzeRouterI from '../interfaces/EezzeRouterI';
import RestState from './RestState';
import { space, ucFirst } from '../libs/StringMethods';
import { checkPort } from '../libs/Command';
import { fileExists, mkdir } from '../libs/FileMethods';

const cors = require('cors');

const healthApp = express();
const morgan = require('morgan');

healthApp.use(cors());
healthApp.use(express.json({ limit: '1000mb' }));
healthApp.use(morgan('combined'));

healthApp.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});

export interface StaticFolder {
    path: string;
    folder: string;
}

export interface START_SERVER_ARGS {
    host: string;
    port: number;
    healthCheckPort: number;
}

export default class EezzeRouter implements EezzeRouterI {
    logger: Logger;
    app: express.Application;
    _srcId: string = '_e_router';

    private _state: E_REQUEST_STATE;
    private _routeNames: any = {};
    private _assetRoutes: any = {};

    public get state() { return this._state }

    constructor(staticFolders: StaticFolder[], logger: Logger) {
        this.logger = logger;

        this.app = express();

        this._state = new RestState();

		this.app.use(cors());
		this.app.use(express.json({ limit: '1000mb' }));

        if (Array.isArray(staticFolders)) {
            for (const sf of staticFolders) {
                if (!fileExists(sf.folder)) {
                    this.logger.info(`Asset folder "${sf.folder}" and will be created`);
                    mkdir(sf.folder);
                }

                this._assetRoutes[sf.path] = sf.folder;

                this.app.use(`/${sf.path.replace(/^\//, '').replace(/\/$/, '')}`, express.static(sf.folder));
            }
        }

        // this.app.use(express.urlencoded({limit: '1000mb'}));
    }

    private listRoutes(stack: any) {
        console.log(`\n${space(2)}Registered Express Server Routes: \n`);

        const self: any = this;

        const stackOut: any = [];

        stack.forEach(function (a: any) {
            const route = a.route;

            if (route) {
                route.stack.forEach(function (r: any) {
                    const method = r.method.toUpperCase();

                    const routeName = self._routeNames[`${method}_${route.path}`] ?? 'na';

                    stackOut.push({'Route Name': routeName, 'Method': method, Path: route.path});

                    // console.log(space(4), `${routeName} - ${method}`, space(8 - method.length), route.path);
                });
            }
        });

        console.table(stackOut);
    }

    addRoute(method: RESTFUL_METHODS, path: string, callback: any, routeName: string) {
        if (typeof method == 'undefined') {
            this.logger.critical(
                `ExpressApp:addRoute - method can not be undefined`,
                {_srcId: 'expressApp_addRoute'}
            );
        }

        this.app[method](path, callback);
        this._routeNames[`${method.toUpperCase()}_${path}`] = ucFirst(routeName);
    }

    startHealthServer(args: START_SERVER_ARGS) {
        healthApp.listen(args.healthCheckPort, '0.0.0.0', () => {
            console.log(`${space(2)}Health Server is running on port 0.0.0.0:${args.healthCheckPort}`);
        });
    }

    start(args: START_SERVER_ARGS) {
		this.app.listen(args.port, '0.0.0.0', () => {
			setTimeout(
                () => {
                    this.listRoutes(this.app._router.stack);

                    if (Object.keys(this._assetRoutes).length > 0) {
                        console.log(`Asset paths: `);

                        console.table(this._assetRoutes);
                    }

                    console.log('\n');

                    console.log(`${space(2)}Rest server listening on 0.0.0.0${args?.port ? `:${args?.port}` : ''}\n`);
                
                    this.startHealthServer(args);
                },
                100
            );

            
		}).on('error', async (err: any) => {
            switch (err.code) {
                case 'EACCES':
                    console.log(`Access Denied: Can not access port. Make sure the port is open and cofigured for this process to use this port`);
                    break;

                case 'EADDRINUSE':
                    this.logger.errorI(`There is already a process listening on port "${args.port}"`, 'EezzeRouter: start: EADDRINUSE error');
                    console.table(await checkPort(args.port));
                    break;
            }
            // if (err.code == 'EADDRINUSE') {

                // var ps = require('ps-node');

                // ps.lookup({ pid: 12345 }, function(err, resultList ) {
                //     if (err) {
                //         throw new Error( err );
                //     }

                //     var process = resultList[ 0 ];

                //     if( process ){

                //         console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
                //     }
                //     else {
                //         console.log( 'No such process found!' );
                //     }
                // });
            // }
        });
    }
}