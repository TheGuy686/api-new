import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadServAllInput extends BaseActionInput {
    @String({
        // required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'Service "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
        message: 'Service "projectId" was not set',
    })
    projectId: string;

}
