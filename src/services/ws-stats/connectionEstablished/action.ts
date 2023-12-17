import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { EAction, Run } from '@eezze/decorators';

@EAction({
	roles: [],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class ConnectionEstablishedAction extends BaseAction {
	@Run()
	async _exec(adm: ActionDataManager) {
		const user = adm.request.auth.user;

		ESet(adm.state, 'connections', (adm.state.connections ?? 0) + 1);

		const users = adm.state?.users ?? {};

		users[user.id] = user;

		ESet(adm.state, 'users', users);

		console.log('State: ', adm.state);
	}
}
