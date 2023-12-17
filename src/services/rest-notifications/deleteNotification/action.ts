import { EAction, DeleteOne, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Notification',
})
export default class DeleteNotificationAction extends BaseAction {
	@DeleteOne({
		checkOn: ['notificationId'],
		input: (adm: ActionDataManager) => {
			return {
				notificationId: adm.input.notificationId
			}
		}
	})
	async _exec() {}
}
