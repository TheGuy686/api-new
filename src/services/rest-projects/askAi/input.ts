import BaseActionInput from '@eezze/base/BaseActionInput';
import ADM from '@eezze/classes/ActionDataManager';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class AskAiActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ADM) => adm.request.auth?.user?.id,
        message: 'AskAiActionInput "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ADM) => adm.request.requestBody?.context,
        message: 'AskAiActionInput "context" was not set',
    })
    context: string;

    @String({
        required: true,
        input: (adm: ADM) => adm.request.requestBody?.prompt,
        message: 'AskAiActionInput "prompt" was not set',
    })
    prompt: string;
}
