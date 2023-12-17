import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateControllerCreateUpdateActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'GenerateControllerUpdateInput "userId" was not set',
    })
    public userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody.id,
        message: 'GenerateControllerUpdateInput "id" was not set',
    })
    public id: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: true,
        message: 'GenerateControllerUpdateInput "projectId" was not set',
    })
    public projectId: string;
}
