import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { LogicChain, ActionDataManager as ADM } from '@eezze/classes';

@EAction({
	roles: [ 'ROLE_ADMIN', 'ROLE_USER' ],
	targetRepo: 'Mysql.StoreRepo',
})
export default class PublishStoreModuleAction extends BaseAction {
	@UpdateOne({
		input: (adm: ADM, lc: LogicChain) => ({
			id: adm.input.id,
			publishApproved: true,
			publishedBy: adm.input.userId,
		})
	})
	async _exec() {}
}
