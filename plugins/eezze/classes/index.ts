import ActionResponse from './ActionResponse';
import * as ActionResponses from './ActionResponses';
import EezzeRequest from './EezzeRequest';
import EezzeWsRequest from './EezzeWsRequest';
import EezzeRouter from './EezzeRouter';
import ESocket from './ESocket';
import ExpressApp from './ExpressApp';
import Request from './Request';
import Logger from './Logger';
import ActionDataManager from './ActionDataManager';
import LogicChain from './logic/LogicChain';
import WsState from './WsState';
import RestState from './RestState';
import PDC from './ProjectDependancyCaches';
import EezzeJwtToken from './EezzeJwtToken';

// @HostSet #3
const connection = (id: string) : E_CONNECTION => {
    try {
        let con = (PDC.getConnection(id, 'classes->connection'));

        con = new (con)().con;

        con.setToExternal();

        return con;
    }
    catch (err) {
        throw new Error(`classes->connection(id)->Error: ${err.message}`);
    }
}

const datasource = (id: string) : any => {
    try {
        let ds = (PDC.getCachedDs(id));

        ds = new (ds)().ds;

        return ds;
    }
    catch (err) {
        throw new Error(`classes->connection(id)->Error: ${err.message}`);
    }
}

export {
    ActionResponse,
    ActionResponses,
    EezzeRequest,
    EezzeWsRequest,
    EezzeRouter,
    ESocket,
    ExpressApp,
    Request,
    Logger,
    ActionDataManager,
    LogicChain,
    WsState,
    RestState,
    EezzeJwtToken,
    connection,
    datasource
}