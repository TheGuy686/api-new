import { EAction, SocketAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Notification',
})
export default class UpdateNotificationAction extends BaseAction {
	@UpdateOne()
	async _exec() {}
}
