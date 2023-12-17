import { EAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.CredentialsVaultRepo',
})
export default class ReadCredentialsVaultAction extends BaseAction {
	@GetOne({
		checkOn: ['id']
	})
	async _exec() {}
}
