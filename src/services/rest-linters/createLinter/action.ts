import { EAction, CreateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.LinterRepo'
})
export default class CreateLinterAction extends BaseAction {
    @CreateOne()
    async _exec() {}
}