import { EAction, CreateOne, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ServiceConfigRepo'
})
export default class CreateServiceConfigAction extends BaseAction {
    @CreateOne()
    @SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken,
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-serv-config-create-update',
		requestBody: (adm: ADM) => ({
            userId: adm.input.userId,
            projectId: adm.input.projectId,
            scId: adm.result.id,
        }),
	})
    async _exec() {}
}