import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { EAction, Do, GetOne } from '@eezze/decorators';
import { Action } from 'rools';

@EAction({
	targetRepo: 'Mysql.ProjectRepo',
})
export default class ProjectChannelAction extends BaseAction {
	@GetOne({
        checkOn: [ 'id' ],
		input: (adm: ActionDataManager) => ({
			id: adm.input.projectId,
		}),
        maximumDepth: 1
    })
	@Do({
		run: (adm: ActionDataManager) => {
			ESet(adm.channelState(`/v1/pr-${adm.input.projectId}`),
				'project',
				adm.result
			);
		}
	})
	async _exec(adm: ActionDataManager) {}
}
