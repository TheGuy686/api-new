import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { EAction, Do, Run } from '@eezze/decorators';

@EAction({
	targetRepo: 'Mysql.ProjectRepo',
})
export default class UserReceivedNotificationAction extends BaseAction {
	@Run()
	async _exec(adm: ActionDataManager) {}
}
