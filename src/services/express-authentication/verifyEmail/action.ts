import { DataTransformer, EAction, Redirect, UpdateOne, } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { datasource } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User'
})
export default class VerifyEmailAction extends BaseAction {
    @DataTransformer({
        output: (adm: ActionDataManager) => {
            return {
                id: adm.input.idTokenDecoded?.id,
                emailVerified: 1,
            };
        }
    })
    @UpdateOne({
        input: (adm: ActionDataManager) => adm.result,
    })
    @Redirect({
        url: (adm: ActionDataManager) => {
            const ds = datasource('integration-eezze-front-end');

            // process.env.VERIFY_REDIRECT_LINK
            // http://192.168.83.180:2000/verify-confirmation?isVerified=true

            return `${ds.source.host}/verify-confirmation?isVerified=true`;
        },
    })
    async _exec() {}
}