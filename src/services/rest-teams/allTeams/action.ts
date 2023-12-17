import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Team'
})
export default class AllTeamsAction extends BaseAction {
	@GetList({
		input: (adm: ActionDataManager) => {
			return {
				projectId: adm.input.projectId,
				active: true,
			};
		},
	})
	async _exec() {}
}
