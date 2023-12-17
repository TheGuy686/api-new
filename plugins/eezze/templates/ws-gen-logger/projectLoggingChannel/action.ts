import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { ESet } from '@eezze/classes/logic';
import { EAction, GetOne, Do } from '@eezze/decorators';

@EAction()
export default class ProjectLoggingChannelAction extends BaseAction {
	@Do({
		run: (adm: ActionDataManager) => {}
	})
	async _exec() {}
}
