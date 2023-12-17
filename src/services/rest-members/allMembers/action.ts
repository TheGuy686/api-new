import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Member'
})
export default class AllMembersAction extends BaseAction {
	@GetList({
		input: (adm: ActionDataManager) => {
			return { id: adm.input.id };
		}
	})
	async _exec() {}
}
