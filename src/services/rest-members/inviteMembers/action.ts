import { ServiceCaller, EAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import LogicChain from '@eezze/classes/logic/LogicChain';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Member'
})
export default class InviteMembersAction extends BaseAction {
	@ServiceCaller({
		service: 'RestMembersService:createMember',
		actionListSource: (adm: ActionDataManager) => JSON.parse(adm.input.invites),
		headers: (adm: ActionDataManager) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ActionDataManager, lc: LogicChain, item: any) => ({
			teamId: item?.teamId,
			email: item?.email,
			permission: item?.permission,
			invitee: adm.request?.auth?.user?.id,
		}),
	})
	async _exec() {}
}
