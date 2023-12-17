import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, Run } from '@eezze/decorators';

@EAction({
	roles: [],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class UserEditingProjectAction extends BaseAction {
	@Run()
	async _exec(adm: ActionDataManager) {
		adm.setResult({
			projectId: adm.request.requestBody.projectId,
			user: adm.request.auth.user,
		});
	}
}
