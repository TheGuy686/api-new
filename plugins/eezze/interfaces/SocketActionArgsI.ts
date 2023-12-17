import { ActionDataManager, LogicChain } from '../classes';

export default interface SocketActionArgsI {
    asynchronous?: boolean;
    eventName: string;
    datasource: string;
    urlParams?: E_CM_CB_OBJ| object;
    requestBody?: E_CM_CB_OBJ | object;
    error?: string;
    success?: string;
    output?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
    actionList?: (adm: ActionDataManager, lc?: LogicChain) => any[];
}