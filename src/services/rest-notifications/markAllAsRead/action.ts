import BaseAction from '@eezze/base/action/BaseAction';
import { EAction, Query } from '@eezze/decorators';
import { ActionDataManager } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Notification',
})
export default class MarkAllAsReadAction extends BaseAction {
	@Query({
		query: (adm: ActionDataManager) => `
			UPDATE notification SET status = 'read' WHERE userId = ?
		`,
		input: (adm: ActionDataManager) => [ adm.request.auth.user.id ]
	})
	async _exec() {}
}
