import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class ReadDatasourceAllAction extends BaseAction {
	@GetList({
		checkOn: [ 'projectId', 'active' ],
        input: (adm: ADM) => ({
			projectId: adm.input.projectId,
			active: true,
		}),
	})
	async _exec() {}
}
