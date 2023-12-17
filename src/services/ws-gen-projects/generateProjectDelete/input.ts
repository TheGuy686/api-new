import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateDatasourceDeleteInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        required: true
    })
    private userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: true,
        message: 'Project "projectId" was not set'
    })
    private projectId: string;
}