import { EAction, CreateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.BlActionResponseType',
})
export default class CreateBlActionResponseTypeAction extends BaseAction {
	@CreateOne()
	async _exec() {}
}
