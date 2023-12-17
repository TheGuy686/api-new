import { EAction, Do, SocketAction, GetOne, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM, ActionDataManager, LogicChain } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ProjectRepo'
})
export default class DeployProjectAction extends BaseAction {
	@GetList({
		repo: 'Mysql.ConnectionRepo',
        checkOn: ['projectId', 'type'],
		input: (adm: ADM, lc: LogicChain) => ({
			projectId: adm.input.projectId,
			type: 'server'
		})
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ADM) => ({ authorization: adm.request.auth.idToken }),
		eventName: 'generate-ansible-create',
		datasource: 'integration-eezze-ws',
		actionList: (adm: ADM, lc: LogicChain) => adm.result,
		requestBody: (adm: ADM, lc: LogicChain, item: any) => ({
			projectId: adm.input.projectId,
			connectionId: item.id,
			connectionType: item.type
		})
	})
    async _exec() {}
}