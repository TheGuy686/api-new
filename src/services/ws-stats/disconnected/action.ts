import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { EAction, Do, GetOne } from '@eezze/decorators';

@EAction({
	targetRepo: 'Mysql.ProjectRepo',
})
export default class DisconnectedAction extends BaseAction {
	@Do({
		run: (adm: ActionDataManager) => {
			const sstate = adm.serverState();

			for (const channel of (Object.values(sstate) as any[]) ?? []) {
				// editing session
				const es = channel?.editingEntitiesSession;

				if (typeof es != 'object' || Object.keys(es).length == 0) continue;

				// only delete the session if the user id is the same
				if (es?.requestId != adm.request?.id) continue;

				// here we need to do this on the session id instead

				console.log('channel before: ', channel);

				ESet(channel, 'editingEntitiesSession', {});

				console.log('channel: ', channel);
			}
		}
	})
	async _exec() {}
}
