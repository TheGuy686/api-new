import { DeleteOne, EAction, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Project',
})
export default class DeleteProjectAction extends BaseAction {
	@DeleteOne({
		checkOn: ['projectId'],
		input: (adm: ActionDataManager) => {
			return {
				projectId: adm.input.projectId
			}
		}
	})
	@SocketAction({
		urlParams: (adm: ActionDataManager) => {
			return {
				'authorization': adm.request.auth.idToken
			}
		},
		eventName: 'generate-project-delete',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => {
			// console.log("adm", adm.request.auth);
			let inp = JSON.parse(JSON.stringify(adm.input));
			return inp;
		}
	})
	async _exec() {}
}
