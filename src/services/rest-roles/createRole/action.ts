import { EAction, CreateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.RoleRepo'
})
export default class CreateRoleAction extends BaseAction {
    @CreateOne()
    async _exec() {}
}