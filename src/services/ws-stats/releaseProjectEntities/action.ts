import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { EAction, Do } from '@eezze/decorators';

@EAction({
	targetRepo: 'Mysql.ProjectRepo',
	condition: (adm: ActionDataManager) => {
		const state    = adm.channelState(`/v1/pr-${adm.input.projectId}`),
			  currSesh = state?.editingEntitiesSession;

		// allow the user to do the action if there is currently no sessions
		if (!currSesh || Object.keys(currSesh).length == 0) return true;

		// allow the user if they are the current editing user
		return currSesh?.userId && currSesh?.userId === adm.input.userId;
	}
})
export default class ReleaseProjectEntitiesAction extends BaseAction {
	@Do({
		run: (adm: ActionDataManager) => {
			ESet(adm.channelState(
				`/v1/pr-${adm.input.projectId}`),
				'editingEntitiesSession',
				{}
			);
		}
	})
	async _exec() {}
}
