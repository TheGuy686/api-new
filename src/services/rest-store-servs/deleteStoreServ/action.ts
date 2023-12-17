import { EAction, DeleteOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class DeleteStoreServAction extends BaseAction {
	@DeleteOne({
		checkOn: ['serviceId'],
		input: (adm: ActionDataManager) => {
			return {
				serviceId: adm.input.serviceId
			}
		}
	})
	async _exec() {}
}
