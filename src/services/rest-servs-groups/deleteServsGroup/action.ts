import { EAction, SocketAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM } from '@eezze/classes';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceGroupRepo',
})
export default class DeleteServsGroupAction extends BaseAction {
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
		eventName: 'generate-controller-delete',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM) => ({
			projectId: adm.input.projectId,
			serviceId: kebabCase(adm.result.name),
		}),
	})
	async _exec() {}
}
