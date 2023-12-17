import { EAction, ReplaceOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreServiceRepo',
})
export default class CreateUpdateStoreServAction extends BaseAction {
	@ReplaceOne()
	async _exec() {}
}
