import BaseAction from '@eezze/base/action/BaseAction';
import { EAction, GetList, ServiceCaller } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ConnectionRep',
})
export default class GenerateConnectionAllAction extends BaseAction {
	@GetList()
	async _exec() {}
}
