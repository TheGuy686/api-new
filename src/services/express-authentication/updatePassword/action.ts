import { EAction, GetOneAndUpdate } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { ResetPassword } from '@eezze/decorators/authentication/JwtAuthentication';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User',
})
export default class UpdatePasswordAction extends BaseAction {
    @ResetPassword({
        password: (adm: ActionDataManager) => adm.input.password
    })
    @GetOneAndUpdate({
        checkOn: [ 'id' ],
        maximumDepth: 0,
        input: (adm: ActionDataManager) => ({
            id: adm.request.auth.user.id,
            salt: adm.result.salt,
            verifier: adm.result.verifier,
        }),
        withValues: (adm: ActionDataManager) => ({
            salt: adm.result.salt,
            verifier: adm.result.verifier
        }),
        onSuccess: (adm: ActionDataManager) => {
            adm.setResult('Password was successfully updated');
        }
    })
    async _exec() {}
}