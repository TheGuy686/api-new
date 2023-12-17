import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ValueStoreRepo',
})
export default class UpdateValueStoreAction extends BaseAction {
	@UpdateOne()
	async _exec() {}
}
