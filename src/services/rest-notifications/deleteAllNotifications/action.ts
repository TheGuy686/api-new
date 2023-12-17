import BaseAction from '@eezze/base/action/BaseAction';
import { EAction, Query } from '@eezze/decorators';
import { ActionDataManager } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Notification',
})
export default class DeleteAllNotificationsAction extends BaseAction {
	@Query({
		query: (adm: ActionDataManager) => `
			DELETE FROM notification WHERE userId = ?
		`,
		input: (adm: ActionDataManager) => {
			console.log([ adm.request.auth.user.id ]);
			return [ adm.request.auth.user.id ];
		}
		// input: (adm: ActionDataManager) => {
		// 	return ['3'];
		// }
	})
	async _exec() {}
}
