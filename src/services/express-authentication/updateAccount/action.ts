import { EAction, UpdateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { LogicChain, ActionDataManager as ADM } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User'
})
export default class UpdateAccountAction extends BaseAction {
    @UpdateOne({
        output: (adm: ADM, lc: LogicChain, result: any) => ({
            id: result.id,
            email: result.email,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
            emailVerified: result.emailVerified,
            roles: result.roles,
            active: result.active,
            avatar: result.avatar,
        }),
    })
    async _exec() {}
}