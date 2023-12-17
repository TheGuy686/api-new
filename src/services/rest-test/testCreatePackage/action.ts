import BaseAction from '@eezze/base/action/BaseAction';
import { EAction, GetOne, SocketAction } from '@eezze/decorators';
import { ActionDataManager as ADM } from '@eezze/classes';

@EAction()
export default class TestCreatePackageAction extends BaseAction {
	@GetOne({
		repo: 'Mysql.ProjectRepo',
		maximumDepth: 1,
		checkOn: [ 'id' ],
		input: (adm: ADM) => ({ id: adm.input?.projectId }),
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			token: adm.request.auth?.idToken
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-project-package-json',
		requestBody: (adm: ADM) => ({
			projectId: adm.result.id,
			projectName: adm.result.projectName,
			description: adm.result.details,
			author: 'Ryan J Cooke',
			licence: 'MIT',
		}),
	})
	async _exec(adm: ADM) {}
}