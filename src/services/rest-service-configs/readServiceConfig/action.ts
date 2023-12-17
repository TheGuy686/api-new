import { EAction, GetOne, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ServiceConfigRepo'
})
export default class ReadServiceConfigAction extends BaseAction {
    @GetOne({
        checkOn: ['id']
    })
    async _exec() {}
}