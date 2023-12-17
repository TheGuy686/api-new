import { EAction, EWhen, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User'
})
export default class RefreshTokenAction extends BaseAction {
    @Do({
        run: (adm: ADM, lc: LogicChain) => {
            if (!adm.input?.refreshTokenDecoded) return;
            adm.setResult(adm.input.refreshTokenDecoded);
        }
    })
    async _exec() {}
}