import { EAction, CreateOne, ServiceCaller, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class CreateStoreAction extends BaseAction {
	@CreateOne()
	async _exec() {}
}
