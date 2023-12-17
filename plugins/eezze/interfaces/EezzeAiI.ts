import { LogicChain } from '../classes';
import ActionDataManager from '../classes/ActionDataManager';

export default interface EezzeClassifyI {
    context: E_CM_CB_STR | string;
    input: E_CM_CB_STR | string;
    beforeExec?: E_CM_CB_ANY | any;
    failOn?: ECONDITIONAL_ITEM[];
    skipOn?: ECONDITIONAL_ITEM[];
    output?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
}