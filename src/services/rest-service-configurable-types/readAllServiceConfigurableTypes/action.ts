import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceConfigurableTypeRepo',
})
export default class ReadAllServiceConfigurableTypesAction extends BaseAction {
	@GetList({
		input: (adm: ActionDataManager) => {
			// console.log('here----------');
			return
		}
	})
	async _exec() {}
}
