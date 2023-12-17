import { CreateOne, EAction, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class CreateProjectAction extends BaseAction {
	@CreateOne({
		repo: 'Mysql.Project',
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-project-create',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => adm.result,
		output: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
