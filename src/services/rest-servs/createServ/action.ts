import { EAction, CreateOne, SocketAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class CreateServAction extends BaseAction {
	@GetOne({
		repo: 'Mysql.ServiceRepo',
		checkOn: [ 'projectId', 'name' ],
		failOn: [
			{
				condition: (adm: ADM) => !!adm.result?.id,
				message: 'entry-with-name-already-exists',
			},
		]
	})
	@CreateOne({
		repo: 'Mysql.ServiceRepo',
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-service-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => adm.result,
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			authorization: adm.request.auth.idToken
		}),
		eventName: 'generate-controller-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => ({
			id: adm.action(0).result?.serviceGroupId,
			projectId: adm.input.projectId,
		}),
		output: (adm: ADM) => adm.action(0).result,
	})
	async _exec() {}
}
