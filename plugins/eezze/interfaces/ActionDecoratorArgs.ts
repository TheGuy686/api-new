import LogicChain from '../classes/logic/LogicChain';
import ActionDataManager from '../classes/ActionDataManager';

export default interface ActionDecoratorArgs {
    input?: E_CM_CB_ANY | any;
    output?: (result: any, adm: ActionDataManager) => any;
    successCode?: number;
    successMessage?: string;
    errorCode?: number;
    errorMessage?: string;
    failOn?: ECONDITIONAL_ITEM[];
    onSuccess?: (adm: ActionDataManager, lc?: LogicChain, addData?: any) => void;
    onError?: (adm: ActionDataManager, lc?: LogicChain) => void;
}