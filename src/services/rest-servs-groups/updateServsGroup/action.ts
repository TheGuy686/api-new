import { EAction, SocketAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceGroupRepo',
})
export default class UpdateServsGroupAction extends BaseAction {
	@UpdateOne()
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-controller-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
