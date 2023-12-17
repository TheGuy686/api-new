import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { ESet } from '@eezze/classes/logic';
import { EAction, GetOne, Do } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class ProjectLoggingChannelAction extends BaseAction {
	@GetOne({
        checkOn: [ 'id' ],
		input: (adm: ActionDataManager) => ({
			id: adm.input.projectId,
		}),
        maximumDepth: 1
    })
	@Do({
		run: (adm: ActionDataManager) => {
			ESet(adm.channelState(`/v1/pr-${adm.request.requestBody?.projectId}`),
				'project',
				adm.result
			);
		}
	})
	async _exec() {}
}
