import { EAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.BlActionResponseTypeRepo',
})
export default class ReadBlActionResponseTypeAction extends BaseAction {
	@GetOne({
		checkOn: ['id']
	})
	async _exec() {}
}
