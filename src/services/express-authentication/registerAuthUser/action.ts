import { EAction, CreateOneIfNotExists, Register, EWhen, Query, DataTransformer, Success, ServiceCaller, Error } from '@eezze/decorators';
import { Service } from '@eezze/classes/ServiceBus';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

@EAction({
    targetRepo: 'Mysql.User'
})
export default class RegisterAuthUserAction extends BaseAction {
    @Register({
        password: (adm: ADM) => adm.input.password,
    })
    @CreateOneIfNotExists({
        checkOn: ['email', 'username'],
        maximumDepth: 0,
        failOnExists: true,
        input: (adm: ADM) => ({
            email: adm.input.email,
            username: adm.input.username,
        }),
        withValues: (adm: ADM) => ({
            firstName: adm.input.firstName,
            lastName: adm.input.lastName,
            roles: adm.input.roles,
            avatar: adm.input.avatar,
            salt: adm.result.salt,
            verifier: adm.result.verifier,
        }),
        onSuccess: async (adm: ADM, lc: LogicChain) => {
            lc.stash.assign.number('createdId', adm.result.id);
            await lc.result();
        }
    })
    @ServiceCaller({
        service: 'ExpressAuthenticationService:sendVerifyAccountEmail',
        requestBody: (adm: ADM) => ({
            email: adm?.request.requestBody?.email
        })
    })
    async _exec() {}

    @Success()
    async _success(adm: ADM) {
        adm.setSuccess('registration-successful');
    }

    @Error()
    async _error(adm: ADM) {
        adm.setError('account-with-email-already-exists');
    }
}