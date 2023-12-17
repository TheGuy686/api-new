import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.CredentialsVaultRepo',
})
export default class UpdateCredentialsVaultAction extends BaseAction {
	@UpdateOne()
	async _exec() {}
}
