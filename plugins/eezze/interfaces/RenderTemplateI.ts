import { LogicChain } from '../classes';
import ActionDataManager from '../classes/ActionDataManager';

export type PRETTYIFIER_MODE = 'loose' | 'strict';

export default interface RenderTemplateI {
    beforeExec?: E_CM_CB_ANY | any;
    template: E_CM_CB_STR | string;
    templateVars?: E_CM_CB_OBJ | object;
    skipOn?: ECONDITIONAL_ITEM[];
    linter?: string;
    prettify?: boolean;
    prettifyMode?: PRETTYIFIER_MODE;
    cache?: boolean;
    output?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
    templates?: {[key: string]: [content: string]}
}