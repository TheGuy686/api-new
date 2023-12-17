import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Obj } from '@eezze/decorators/models/types';

@EActionInput()
export default class LogActionInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: true,
        message: 'Log "projectId" was not set'
    })
    private projectId: string;

    @Obj({
        input: (adm: ActionDataManager) => adm.request.requestBody?.data,
        required: true,
        message: 'Log "data" was not set'
    })
    private data: object;
}
