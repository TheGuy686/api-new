import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.LinterRepo'
})
export default class ReadAllLintersAction extends BaseAction {
    @GetList()
    async _exec() {}
}