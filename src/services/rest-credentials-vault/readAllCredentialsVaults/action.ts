import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.CredentialsVaultRepo',
})
export default class ReadAllCredentialsVaultsAction extends BaseAction {
	@GetList({
        checkOn: ['projectId'],
        input: (adm: ActionDataManager) => {
            return { projectId: adm.input.projectId }
        }
    })
	async _exec() {}
}
