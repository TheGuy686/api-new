import Logger from './Logger';
import ExpressApp, { START_SERVER_ARGS, StaticFolder } from './ExpressApp';

interface RouterArgs {
    logger: Logger;
    staticFolders: StaticFolder[];
}

export default class EezzeRouter {
    logger: Logger;
    router: ExpressApp;
    type: string;

    public get state() { return this.router.state }

    constructor(args: RouterArgs, type: string) {
        this.logger = args.logger;
        this.type = type;
        this.initType(type, args.staticFolders);
    }

    getState() { return this.state }

    initType(type: string = 'express', staticFolders?: StaticFolder[]) {
        switch (type) {
            case 'express':
                this.router = new ExpressApp(staticFolders, this.logger);
                break;
        }
    }

    addRoute(method: RESTFUL_METHODS, path: string, callback: any, routeName: string) {
        this.router.addRoute(method, path, callback, routeName);
    }

    start(args: START_SERVER_ARGS) {
        this.router.start(args);
    }
}