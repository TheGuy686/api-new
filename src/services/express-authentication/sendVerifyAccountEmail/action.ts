import { EAction, GetOne, ServiceCaller, Do } from '@eezze/decorators';

import BaseAction from '@eezze/base/action/BaseAction';
import EezzeJwtToken from '@eezze/classes/EezzeJwtToken';
import ActionDataManager from '@eezze/classes/ActionDataManager';

import { LogicChain, datasource } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User'
})
export default class SendVerifyAccountEmailAction extends BaseAction {
    @GetOne({
        checkOn: ['email'],
        maximumDepth: 0,
        onSuccess: async (adm: ActionDataManager, lc: LogicChain) => {
            lc.stash.assign.object('user', adm.result);

            let name = '';

            if (adm.result?.firstName) {
                name = `${adm.result?.firstName} ${adm.result?.lastName}${adm.result?.username ? `(${adm.result?.username})` : ''}`;
            }
            else name = '';

            lc.stash.assign.text('name', name);

            await lc.result();
        },
    })
    @Do({
        run: async (adm: ActionDataManager, lc: LogicChain) => {
            lc.stash.assign.text('token', EezzeJwtToken.getToken(
                {
                    id: adm.result.id,
                    email: adm.result.email,
                    username: adm.result.username,
                    firstName: adm.result.firstName,
                    lastName: adm.result.lastName,
                    emailVerified: adm.result.emailVerified,
                    roles: adm.result.roles,
                },
                { days: 3 },
                { type: 'verify-token' },
                process.env.JWT_SECRET
            ));

            lc.stash.assign.text('idToken', EezzeJwtToken.getToken(
                {
                    id: adm.result.id,
                    email: adm.result.email,
                    username: adm.result.username,
                    firstName: adm.result.firstName,
                    lastName: adm.result.lastName,
                    emailVerified: adm.result.emailVerified,
                    roles: adm.result.roles,
                },
                { days: 3 },
                { type: 'id-token' },
                process.env.JWT_SECRET
            ));

            await lc.result();
        }
    })
    @ServiceCaller({
        service: 'LocalEmailingService:sendMail',
        headers: (adm: ActionDataManager, lc: LogicChain) => ({
            authorization: lc.stash.prop('idToken'),
        }),
        requestBody: (adm: ActionDataManager, lc: LogicChain) => {
            const ds = datasource('integration-eezze-rest');

            // process.env.VERIFY_ACCOUNT_LINK
            // http://192.168.83.180:2002/v1/auth/verify-email

            return {
                to: [ adm.input.email ],
                from: process.env.EMAIL_SERVICE_FROM_EMAIL,
                fromFirstName: process.env.EMAIL_SERVICE_FROM_FIRST_NAME,
                fromLastName: process.env.EMAIL_SERVICE_FROM_LAST_NAME,
                subject: 'Eezze Registration',
                template: 'verify-account',
                templateVars: {
                    verifyEmailLink: `${ds.source.host}/v1/auth/verify-email`,
                    username: lc.stash.prop('user').username,
                    name: lc.stash.prop('name'),
                    token: lc.stash.prop('token')
                },
            };
        }
    })
    async exec() {}
}