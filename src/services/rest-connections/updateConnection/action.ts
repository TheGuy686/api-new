import { EAction, UpdateOne, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.Connection'
})
export default class UpdateConnectionAction extends BaseAction {
	@UpdateOne()
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-connection-create-update',
		requestBody: (adm: ADM) => ({ id: adm.result.id }),
	})
    async _exec() {}
}