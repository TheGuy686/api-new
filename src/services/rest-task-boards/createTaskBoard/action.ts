import { CreateOne, EAction, GetOne, ServiceCaller } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import EezzeJwtToken from '@eezze/classes/EezzeJwtToken';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Board',
})
export default class CreateTaskBoardAction extends BaseAction {
	// a team with this teamId already exists, remove the commented section.
	@CreateOne({
		input: (adm: ActionDataManager) => ({
			id: adm.input?.id,
			team: adm.input.teamId,
			board: {
				board: {
					backlog:{
						key: 'backlog',
						tasks: []
					},
					inProgress:{
						key: 'inProgress',
						tasks: []
					},
					inReview:{
						key: 'inReview',
						tasks: []
					},
					qAndA:{
						key: 'qAndA',
						tasks: []
					},
					done:{
						key: 'done',
						tasks: []
					}
				}
			}
		}),
	})
	async _exec() {}
}
