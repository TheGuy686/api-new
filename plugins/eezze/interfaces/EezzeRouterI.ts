import Logger from '../classes/Logger';

export default interface EezzeRouterI {
    logger: Logger;
    app: any;
    addRoute: Function;
    start: Function;
}