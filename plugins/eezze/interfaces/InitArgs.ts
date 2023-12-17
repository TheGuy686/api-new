import Logger from '../classes/Logger';
import EezzeRouter from '../classes/EezzeRouter';
import SocketConfigI from './SocketConfigI';

export default interface initArgs {
    router: EezzeRouter,
    logger: Logger,
    sockets?: SocketConfigI[],
}