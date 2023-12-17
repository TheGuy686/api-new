import { GetOneAndUpdate, EAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Member',
})
export default class DeleteMemberAction extends BaseAction {
	@GetOneAndUpdate({
		maximumDepth: 1,
		checkOn: [ 'id' ],
		input: (adm: ActionDataManager) => ({
			id: adm.input?.id
		}),
		withValues: (adm: ActionDataManager) => ({
			id: adm.input?.id,
			updatedBy: adm.request.auth?.user?.id,
			active: false,
		})
	})
	async _exec() {}
}
