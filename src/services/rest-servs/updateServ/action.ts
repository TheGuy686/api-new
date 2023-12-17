import { EAction, SocketAction, UpdateOne } from '@eezze/decorators';
import { LogicChain, ActionDataManager as ADM } from '@eezze/classes';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class UpdateServAction extends BaseAction {
	@UpdateOne({
		output: (adm: ADM, lc: LogicChain, res: any) => {
			const definition: any = ((): any => {
				try {
					return JSON.parse(res.definition);
				}
				catch (err) { return [] }
			})();
			const logic: any = ((): any => {
				try {
					return JSON.parse(res.logic);
				}
				catch (err) { return [] }
			})();

			return {
				...res,
				definition,
				logic,
			};
		}
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			authorization: adm.request.auth.idToken
		}),
		eventName: 'generate-service-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => adm.result,
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			authorization: adm.request.auth.idToken
		}),
		eventName: 'generate-controller-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => ({
			id: adm.action(0).result?.serviceGroupId,
			projectId: adm.input.projectId,
		}),
	})
	async _exec() {}
}
