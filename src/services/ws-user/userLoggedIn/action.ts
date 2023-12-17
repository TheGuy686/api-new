import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { EAction, Run } from '@eezze/decorators';

@EAction({
	roles: [],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class UserLoggedInAction extends BaseAction {
	@Run()
	async _exec(adm: ActionDataManager) {
		// console.log('User Logged in: ', adm);

		// console.log(adm.channelState('/v1/pr-1'));

		// ESet(adm.channelState('/v1/pr-1'), 'message', 'Ryan just got to here');
		// console.log('User Logged in222: ', adm);

		// console.log('Channel: ', adm.channelState('/v1/pr-1'));
	}
}
