import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateServConfigCreateUpdateActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.scId,
        message: 'GenerateServConfigCreateUpdateActionInput "id" was not set',
    })
    private scId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'GenerateServConfigCreateUpdateActionInput "userId" was not set',
        required: true,
    })
    private userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        message: 'GenerateServConfigCreateUpdateActionInput "projectId" was not set',
        required: true,
    })
    private projectId: string;
}
