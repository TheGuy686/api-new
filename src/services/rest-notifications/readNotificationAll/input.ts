import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadNotificationAllInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'Action "userId" was not set',
    })
    userId: string;
}
