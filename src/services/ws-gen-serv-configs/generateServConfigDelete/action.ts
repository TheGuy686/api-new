import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, EWhen } from '@eezze/decorators';
import { deleteFile } from '@eezze/libs/FileMethods'

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GenerateServConfigDeleteAction extends BaseAction {
	@EWhen({
		source: (adm: ActionDataManager) => adm?.input,
		condition: (adm: ActionDataManager, items: any) => true,
		actions: [{
			condition: (adm: ActionDataManager, sourceItem: any) => true,
			action: (adm: ActionDataManager, item: any) => {
				deleteFile(`${process.env.PROJECT_FILE_PATH}projects/${adm.input.projectId}/src/services/${adm.input.serviceId}/controller.ws.ts`)
				deleteFile(`${process.env.PROJECT_FILE_PATH}projects/${adm.input.projectId}/src/services/${adm.input.serviceId}/config.yaml`)
			}
		}]
	})
	async _exec() {}
}
