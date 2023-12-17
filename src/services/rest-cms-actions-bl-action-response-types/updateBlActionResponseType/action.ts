import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.BlActionResponseTypeRepo',
})
export default class UpdateBlActionResponseTypeAction extends BaseAction {
	@UpdateOne()
	async _exec() {}
}
