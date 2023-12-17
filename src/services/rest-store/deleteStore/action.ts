import { EAction, DeleteOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class DeleteStoreAction extends BaseAction {
	@DeleteOne({
		checkOn: ['id'],
		input: (adm: ActionDataManager) => {
			return {
				id: adm.input.id
			}
		}
	})
	async _exec() {}
}
