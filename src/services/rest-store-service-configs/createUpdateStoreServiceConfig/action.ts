import { EAction, ReplaceOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.StoreServiceConfigRepo'
})
export default class CreateUpdateStoreServiceConfigAction extends BaseAction {
    @ReplaceOne()
    async _exec() {}
}