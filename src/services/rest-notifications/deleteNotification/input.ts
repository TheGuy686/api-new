import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class DeleteNotificationInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'Notification "userId" was not set',
    })
    userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.urlParams?.notificationId,
        required: true,
        message: 'Notification "notificationId" was not set',
    })
    private notificationId: string;
}
