import { LogicChain } from '../classes';
import ActionDataManager from '../classes/ActionDataManager';

interface AiMessageI {
    role: string;
    content: string;
}

export default interface OpenAIPromptI {
    apiKey: string;
    model?: string;
    prompt?: E_CM_CB_ANY;
    messages: AiMessageI[];
    failOn?: ECONDITIONAL_ITEM[];
    beforeExec?: E_CM_CB_ANY | any;
    skipOn?: ECONDITIONAL_ITEM[];
    output?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
}