import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.BlActionTypeRepo',
})
export default class ReadAllBlActionTypesAction extends BaseAction {
	@GetList()
	async _exec() {}
}
