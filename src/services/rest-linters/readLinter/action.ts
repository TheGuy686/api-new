import { EAction, GetOne, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.LinterRepo'
})
export default class ReadLinterAction extends BaseAction {
    @GetOne({
        checkOn: ['id']
    })
    async _exec() {}
}