import { EAction, ServiceCaller, SocketAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class UpdateDatasourceAction extends BaseAction {
	@UpdateOne()
	@SocketAction({
		asynchronous: false,
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-datasource-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => ({
			...adm.input,
			previousName: adm.previousResult?.name
		}),
	})
	@ServiceCaller({
		service: 'RestDatasourcesService:transformDsEntities',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		urlParams: (adm: ADM) => ({
			projectId: adm.input?.projectId,
			id: adm.input?.id,
		}),
		// here we just need to get the entities from the transformed object
		output: (adm: ADM, lc: LogicChain, res: any) => {
			return EJson.parseKeyObject(res, 'body');
		},
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken,
		}),
		eventName: 'generate-migration-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => adm.result,
	})
	@SocketAction({
		asynchronous: true,
		datasource: 'integration-eezze-stats-ws',
		eventName: 'datasources-changed',
		urlParams: (adm: ADM) => ({
			authorization: adm.request.auth.idToken,
		}),
		requestBody: (adm: ADM) => ({
			projectId: adm.input.projectId,
		}),
	})
	async _exec() {}
}
