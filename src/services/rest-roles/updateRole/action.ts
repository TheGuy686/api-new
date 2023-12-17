import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.RoleRepo'
})
export default class UpdateRoleAction extends BaseAction {
    @UpdateOne()
    async _exec() {}
}