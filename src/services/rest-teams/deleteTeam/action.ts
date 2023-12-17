import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Team',
})
export default class DeleteTeamAction extends BaseAction {
	@UpdateOne({
		input: (adm: ActionDataManager) => {
			return {
				id: adm.input.id,
				active: false,
			}
		},
	})
	async _exec() {}
}
