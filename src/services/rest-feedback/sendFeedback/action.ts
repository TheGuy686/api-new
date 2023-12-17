import { EAction, CreateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class SendFeedbackAction extends BaseAction {
	@CreateOne({
		repo: 'Mysql.FeedbackRepo',
		input: (adm: ActionDataManager) => ({
			subject: adm.input.subject,
			message: adm.input.message,
			from: adm.input.userId,
		})
	})
	async _exec() {}
}
