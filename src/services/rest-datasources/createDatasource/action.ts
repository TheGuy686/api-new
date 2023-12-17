import { EAction, CreateOne, ServiceCaller, SocketAction, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class CreateDatasourceAction extends BaseAction {
	@CreateOne()
	@SocketAction({
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-datasource-create-update',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => ({
			userId: adm.input.userId,
			projectId: adm.input.projectId,
			id: adm.result.id
		})
	})
	@SocketAction({
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		eventName: 'generate-migration-setup',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => ({
			type: adm.action(0).result.type,
			userId: adm.input.userId,
			projectId: adm.input.projectId,
			id: adm.action(0).result.id
		})
	})
	@SocketAction({
		datasource: 'integration-eezze-stats-ws',
		eventName: 'datasources-changed',
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken
		}),
		requestBody: (adm: ActionDataManager) => ({
			projectId: adm.input.projectId,
		})
	})
	@Do({
		run: (adm: ActionDataManager) => adm.setResult(adm.action(0).result),
	})
	async _exec() {}
}
