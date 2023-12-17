import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import { EAction, EWhen, FileDelete } from '@eezze/decorators';
import { deleteFile } from '@eezze/libs/FileMethods'

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GenerateControllerDeleteAction extends BaseAction {
	@FileDelete({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM) => `projects/${adm.input.projectId}/src/services`,
		fileName: (adm: ADM) => adm.input.serviceId,
	})
	async _exec() {}
}
