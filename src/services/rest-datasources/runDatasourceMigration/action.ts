import { DataTransformer, EAction, SocketAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class RunDatasourceMigrationAction extends BaseAction {
	@GetOne({ checkOn: [ 'id' ] })
	@SocketAction({
		urlParams: (adm: ActionDataManager) => {
			return {
				'authorization': adm.request.auth.idToken
			}
		},
		eventName: 'generate-migration-run',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ActionDataManager) => {
			const data = adm.action(0).result;

			return {
				type: data.type,
				userId: adm.input.userId,
				projectId: adm.input.projectId,
				id: data.id
			};
		}
	})
	async _exec() {}
}
