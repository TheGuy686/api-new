import { DataTransformer, EAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User'
})
export default class RetrieveAuthUserAction extends BaseAction {
    @GetOne({
        checkOn: [ 'id' ],
        maximumDepth: 0,
        output: async (adm: ADM, lc: any, result: any) => ({
            user: await adm.request.auth.getUser(result, adm),
        }),
    })
    async _exec() {}
}