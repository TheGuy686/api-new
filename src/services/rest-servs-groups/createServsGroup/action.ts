import { EAction, CreateOne, SocketAction, DeleteOne, Query } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceGroupRepo',
})
export default class CreateServsGroupAction extends BaseAction {
	@CreateOne()
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-controller-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => adm.action(0).result,
		output: (adm: ADM) => adm.action(0).result,
	})
	async _exec() {}
}
