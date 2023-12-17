import { EAction, CreateOneIfNotExists } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreReviewRepo',
})
export default class AddReviewAction extends BaseAction {
	@CreateOneIfNotExists({
		checkOn: [ 'store', 'reviewer' ],
		input: (adm: ADM) => ({
			store: adm.input.store,
			comment: adm.input.comment,
			rating: adm.input.rating,
			reviewer: adm.input.reviewer
		}),
		withValues: (adm: ADM) => ({
			store: adm.input.store,
			comment: adm.input.comment,
			rating: adm.input.rating,
			reviewer: adm.input.reviewer
		}),
	})	
	async _exec() {}
}
