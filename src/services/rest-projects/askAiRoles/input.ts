import BaseActionInput from '@eezze/base/BaseActionInput';
import ADM from '@eezze/classes/ActionDataManager';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class AskAiRolesInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ADM) => adm.request.auth?.user?.id,
        message: 'AskAiRolesInput "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ADM) => adm.request.requestBody?.prompt,
        message: 'AskAiRolesInput "prompt" was not set',
    })
    prompt: string;
}
