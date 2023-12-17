import { EAction, GetOneAndUpdate } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ResetPassword } from '@eezze/decorators/authentication/JwtAuthentication';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User',
})
export default class ResetPasswordAction extends BaseAction {
    @ResetPassword({
        password: (adm: ActionDataManager) => adm.input.password
    })
    @GetOneAndUpdate({
        checkOn: [ 'id' ],
        maximumDepth: 0,
        input: (adm: ActionDataManager) => ({ id: adm.input.id }),
        withValues: (adm: ActionDataManager) => ({
            salt: adm.result.salt,
            verifier: adm.result.verifier
        }),
    })
    async _exec() {}
}