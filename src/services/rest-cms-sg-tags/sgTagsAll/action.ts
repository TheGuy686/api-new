import { EAction, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

import supTypes from 'services/rest-store/getStoreTags/supported-tags';

const { keywords } = supTypes();

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class SgTagsAllAction extends BaseAction {
	@Do({
		run: (adm: ADM) => {
			adm.setResult(keywords);
		},
	})
	async _exec() {}
}