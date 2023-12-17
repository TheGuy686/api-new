import { EAction, CreateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceConfigurableTypeRepo',
})
export default class CreateServiceConfigurableTypeAction extends BaseAction {
	@CreateOne()
	async _exec() {}
}
