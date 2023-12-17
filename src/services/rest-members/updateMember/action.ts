import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.MemberRepo'
})
export default class UpdateMemberAction extends BaseAction {
    @UpdateOne()
    async _exec() {}
}