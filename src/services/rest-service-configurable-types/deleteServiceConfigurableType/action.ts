import { EAction, DeleteOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceConfigurableTypeRepo',
})
export default class DeleteServiceConfigurableTypeAction extends BaseAction {
	@DeleteOne({
		checkOn: ['key'],
		input: (adm: ActionDataManager) => {
			return {
				key: adm.input.key
			}
		}
	})
	async _exec() {}
}
