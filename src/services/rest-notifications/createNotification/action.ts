import BaseAction from '@eezze/base/action/BaseAction';
import { EAction, CreateOne, SocketAction } from '@eezze/decorators';
import { ActionDataManager } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Notification',
})
export default class CreateNotificationAction extends BaseAction {
	@CreateOne()
	@SocketAction({
		asynchronous: true,
		datasource: 'integration-eezze-stats-ws',
		eventName: 'user-received-notification',
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		requestBody: (adm: ActionDataManager) => ({
			userId: adm.input.userId,
		})
	})
	async _exec() {}
}
