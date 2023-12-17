import { CreateOne, EAction, ServiceCaller, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Team'
})
export default class CreateTeamAction extends BaseAction {
	@CreateOne({
		input: (adm: ActionDataManager) => ({
			name: adm.input.name,
			description: adm.input.description,
			project: adm.input.projectId,
			active: true,
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
	// @ServiceCaller({
	// 	service: 'RestTaskBoardsService:createTaskBoard',
	// 	headers: (adm: ActionDataManager) => {
	// 		return {
	// 			authorization: adm.request?.auth?.idToken,
	// 		};
	// 	},
	// 	requestBody: (adm: ActionDataManager) => ({
	// 		teamId: adm.result.id,
	// 	}),
	// })
	// @UpdateOne({
	// 	input: (adm: ActionDataManager) => {
	// 		return {
	// 			id: adm.action(0).result.id,
	// 			board: adm.result.id
	// 		}
	// 	},
	// })
	async _exec() {}
}
