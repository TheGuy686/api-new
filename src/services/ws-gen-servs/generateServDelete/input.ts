import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateServDeleteInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.actionId,
        message: 'Action "actionId" was not set',
    })
    actionId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.serviceId,
    })
    private serviceId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.operationId,
    })
    private operationId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        required: true
    })
    private userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: true,
    })
    private projectId: string;
}
