import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, Run } from '@eezze/decorators';
import { ESet } from '@eezze/classes/logic';

@EAction({
	roles: [],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class ConnectionLostAction extends BaseAction {
	@Run()
	async _exec(adm: ActionDataManager) {
		// ESet(adm.state, 'connections', adm.state.connections - 1);

		// const users = adm.state?.users ?? {};

		// delete users[adm.request.auth.user.id];

		// ESet(adm.state, 'users', users);
	}
}
