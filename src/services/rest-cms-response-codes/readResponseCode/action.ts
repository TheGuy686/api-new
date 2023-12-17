import { EAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ResponseCodeRepo',
})
export default class ReadResponseCodeAction extends BaseAction {
	@GetOne({
		checkOn: ['id']
	})
	async _exec() {}
}
