import { EAction, SocketAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.Board'
})
export default class UpdateTaskBoardAction extends BaseAction {
	@UpdateOne({
		input: (adm: ActionDataManager) => ({
			id: adm.input.id,
			teamId: adm.input.teamId,
			board: adm.input.board,
		})
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		datasource: 'integration-eezze-stats-ws',
		eventName: 'update-project-state',
		requestBody: (adm: ActionDataManager) => ({
			projectId: adm.input.projectId,
		})
	})
	async _exec() {}
}