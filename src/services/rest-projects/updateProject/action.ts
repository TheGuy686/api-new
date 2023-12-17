import { EAction, UpdateOne, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ProjectRepo'
})
export default class UpdateProjectAction extends BaseAction {
    @UpdateOne()
    @SocketAction({
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-project-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => {
			return adm.result;
		},
	})
    async _exec() {}
}