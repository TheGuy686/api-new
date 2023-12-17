import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceGroupRepo',
})
export default class ReadServsGroupAllAction extends BaseAction {
	@GetList({
		input: (adm: ActionDataManager) => ({
			projectId: adm.input.projectId,
			active: true,
		})
	})
	async _exec() {}
}
