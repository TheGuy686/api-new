import { EAction, ServiceCaller, SocketAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class UpdateDatasourceEntitiesAction extends BaseAction {
	@UpdateOne({
		repo: 'Mysql.DatasourceRepo',
		input: (adm: ActionDataManager) => ({
			id: adm.input.id,
			initModel: adm.input.initModel,
		}),
	})
	@ServiceCaller({
		service: 'RestDatasourcesService:transformDsEntities',
		headers: (adm: ActionDataManager) => {
			return {
				authorization: adm.request?.auth?.idToken,
			};
		},
		urlParams: (adm: ActionDataManager) => ({
			projectId: adm.input?.projectId,
			id: adm.input?.id,
		}),
		// here we just need to get the entities from the transformed object
		output: (adm: ActionDataManager, lc: LogicChain, res: any) => {
			return EJson.parseKeyObject(res, 'body');
		},
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-all-entities',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => adm.action(1).result
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-datasource-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => adm.action(1).result,
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-migration-files',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => adm.action(1).result,
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-migration-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => adm.action(1).result,
	})
	@SocketAction({
		asynchronous: true,
		datasource: 'integration-eezze-stats-ws',
		eventName: 'datasources-changed',
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		requestBody: (adm: ActionDataManager) => ({
			projectId: adm.input.projectId,
		})
	})
	async _exec() {}
}
