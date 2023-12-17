import { ActionDataManager, LogicChain } from '../classes';

export default interface RestActionArgsI {
    datasource?: string;
    method: RESTFUL_METHODS;
    urlPath?: (adm: ActionDataManager, lc?: LogicChain) => string | string;
    headers?: (adm: ActionDataManager, lc?: LogicChain) => object | object;
    urlParams?: (adm: ActionDataManager, lc?: LogicChain) => object | object;
    requestBody: (adm: ActionDataManager, lc?: LogicChain) => object | object;
    showUploadFeedBackCb?: Function;
    output?: (result: any, adm: ActionDataManager, lc?: LogicChain) => any;
    onSuccess?: (adm: ActionDataManager, lc?: LogicChain) => void;
}