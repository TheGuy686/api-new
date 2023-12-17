import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateServRefreshInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        required: false
    })
    private userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: false
    })
    private projectId: string;
}
