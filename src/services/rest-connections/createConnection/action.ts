import { EAction, CreateOne, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ConnectionRepo'
})
export default class CreateConnectionAction extends BaseAction {
    @CreateOne()
    @SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-connection-create-update',
		requestBody: (adm: ADM) => ({ id: adm.result.id }),
		onSuccess: (adm: ADM) => {
			adm.setResult(adm.action(0).result);
		}
	})
    async _exec() {}
}