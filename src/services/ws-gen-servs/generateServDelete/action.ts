import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, EWhen, When } from '@eezze/decorators';
import { deleteFile } from '@eezze/libs/FileMethods'
import { ucFirst, kebabCase, camelCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class GenerateServDeleteAction extends BaseAction {
	@EWhen({
		source: (adm: ActionDataManager) => adm?.input,
		condition: (adm: ActionDataManager, items: any) => true,
		actions: [{
			condition: (adm: ActionDataManager, sourceItem: any) => true,
			action: (adm: ActionDataManager, item: any) => {
				// console.log("adm", adm.input);
				deleteFile(`${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}/src/services/${kebabCase(adm.input.serviceId)}/${ucFirst(adm.input.actionId)}/action/action-input.ts`)
				deleteFile(`${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}/src/services/${kebabCase(adm.input.serviceId)}/${ucFirst(adm.input.actionId)}/action/index.ts`)
				deleteFile(`${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}/src/services/${kebabCase(adm.input.serviceId)}/${ucFirst(adm.input.actionId)}/service.ts`)
			}
		}]
	})
	async _exec() {}
}
