import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.RoleRepo'
})
export default class ReadAllRolesAction extends BaseAction {
    @GetList({
        checkOn: ['projectId'],
        input: (adm: ActionDataManager) => {
            return {
                projectId: adm.input.projectId,
                active: true,
            }
        }
    })
    async _exec() {}
}