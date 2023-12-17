import { EAction, GetOne, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';

@EAction({
    targetRepo: 'Mysql.NotificationRepo'
})
export default class AllNotificationsAction extends BaseAction {
    @GetList()
    async _exec() {}
}