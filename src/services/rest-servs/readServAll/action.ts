import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class ReadServAllAction extends BaseAction {
	@GetList({
		checkOn: ['projectId'],
        input: (adm: ActionDataManager) => {
            return { projectId: adm.input.projectId }
        }
	})
	async _exec() {}
}
