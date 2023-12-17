import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager, LogicChain } from '@eezze/classes';
import { EAction, GetList, ServiceCaller } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class GenerateServAllAction extends BaseAction {
	@GetList()
	@ServiceCaller({
		service: 'WsGenActionsService:generateActionAll',
		actionListSource: (adm: ActionDataManager) => adm.input.successResult?.body,
		urlParams: (adm: ActionDataManager, lc?: LogicChain, item?: any) => {
			return {
				authorization: adm.request.auth?.idToken,
			};
		},
		requestBody: (adm: ActionDataManager, lc?: LogicChain, item?: any) => {
			return {
				serviceId: item?.serviceId,
				restful: JSON.parse(item?.restful ?? '{}'),
				ws: JSON.parse(item?.ws ?? '{}'),
			};
		},
	})
	async _exec() {}
}
