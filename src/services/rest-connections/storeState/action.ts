import BaseAction from '@eezze/base/action/BaseAction';
import { EAction, GetOne, UpdateOne } from '@eezze/decorators';
import { ActionDataManager } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ConnectionRepo'
})
export default class StoreStateAction extends BaseAction {
    @GetOne({ checkOn: ['id'] })
    @UpdateOne({
        input: (adm: ActionDataManager) => ({
            id: adm.input.id,
            state: adm.input.state,
            metadata: JSON.stringify(adm.result.metadata, null, 4),
        })
    })
    async _exec() {}
}