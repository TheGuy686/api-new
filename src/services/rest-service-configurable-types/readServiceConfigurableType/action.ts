import { EAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceConfigurableTypeRepo',
})
export default class ReadServiceConfigurableTypeAction extends BaseAction {
	@GetOne({
		checkOn: [ 'key' ]
	})
	async _exec() {}
}
