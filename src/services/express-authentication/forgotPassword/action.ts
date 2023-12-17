import { EAction, GetOne, ServiceCaller } from '@eezze/decorators';
import { datasource } from '@eezze/classes';

import BaseAction from '@eezze/base/action/BaseAction';
import EezzeJwtToken from '@eezze/classes/EezzeJwtToken';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class ForgotPasswordAction extends BaseAction {
    @GetOne({
        repo: 'Mysql.User', 
        checkOn: ['email']
    })
    @ServiceCaller({
        service: 'LocalEmailingService:sendMail',
        headers: (adm: ActionDataManager) => {
            return {
                authorization: EezzeJwtToken.sign(
                    { id: adm.result?.id },
                    { minutes: 5 },
                    '',
                    { type: 'id-token' }
                ).token,
            };
        },
        requestBody: (adm: ActionDataManager) => {
            const ds = datasource('integration-eezze-front-end');

            return {
                to: [ adm.input.email ],
                from: process.env.EMAIL_SERVICE_FROM_EMAIL,
                fromFirstName: process.env.EMAIL_SERVICE_FROM_FIRST_NAME,
                fromLastName: process.env.EMAIL_SERVICE_FROM_LAST_NAME,
                subject: 'Eezze Forgot Password',
                template: 'forgot-password',
                templateVars: {
                    resetPasswordUrl: `${ds.source.host}/reset-password`,
                    username: adm.result.username,
                    name: `${adm.result.firstName} ${adm.result.lastName}`,
                    token: EezzeJwtToken.sign(
                        { id: adm.result?.id },
                        { minutes: 5 },
                        '',
                        { type: 'reset-password' }
                    ).token,
                },
            };
        }
    })
    async _exec() {}
}