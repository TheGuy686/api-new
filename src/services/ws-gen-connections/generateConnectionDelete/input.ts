import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateConnectionDeleteInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.serviceId,
    })
    private serviceId: string;

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
