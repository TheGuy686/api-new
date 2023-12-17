import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Int } from '@eezze/decorators/models/types';

@EActionInput()
export default class UserReceivedNotificationActionInput extends BaseActionInput {
    @Int({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.userId,
        message: 'UserReceivedNotification "userId" was not set',
    })
    userId: string;
}
