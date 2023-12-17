import BaseAction from '@eezze/base/action/BaseAction';
import { EAction } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class GenerateServRefreshAction extends BaseAction {
	async _exec() {}
}
