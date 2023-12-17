import { EAction, UpdateOne, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class DeleteDatasourceAction extends BaseAction {
	@UpdateOne({
		input: (adm: ADM) => ({
			id: adm.input.id,
			active: false,
		}),
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-datasource-delete',
		requestBody: (adm: ADM) => ({
			projectId: adm.input.projectId,
			id: adm.input.id,
		})
	})
	// @SocketAction({
	// 	asynchronous: false,
	// 	datasource: 'integration-eezze-stats-ws',
	// 	eventName: 'datasources-changed',
	// 	urlParams: (adm: ADM) => ({
	// 		'authorization': adm.request.auth.idToken
	// 	}),
	// 	requestBody: (adm: ADM) => ({
	// 		projectId: adm.input.projectId,
	// 	})
	// })
	// @UpdateOne({
	// 	input: (adm: ADM) => ({
	// 		id: adm.input.id,
	// 		active: true,
	// 	})
	// })
	async _exec() {}
}
