import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, EWhen, When } from '@eezze/decorators';
import { deleteFile } from '@eezze/libs/FileMethods'

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Project'
})
export default class GenerateProjectDeleteAction extends BaseAction {
	@EWhen({
		source: (adm: ActionDataManager) => adm?.input,
		condition: (adm: ActionDataManager, items: any) => true,
		actions: [{
			condition: (adm: ActionDataManager, sourceItem: any) => true,
			action: (adm: ActionDataManager, item: any) => {
				console.log("adm", adm.input);
				deleteFile(`${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}`)
			}
		}]
	})
	async _exec() {}
}
