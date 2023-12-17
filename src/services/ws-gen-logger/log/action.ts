import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { ESet } from '@eezze/classes/logic';
import { EAction, Run, Do } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class LogAction extends BaseAction {
	@Do({
		run: (adm: ActionDataManager) => {
			adm.setResult(adm.input?.data);
		}
	})
	async _exec() {}
}
