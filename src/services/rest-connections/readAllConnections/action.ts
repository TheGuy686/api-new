import { EAction, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.ConnectionRepo'
})
export default class ReadAllConnectionsAction extends BaseAction {
    @GetList({
        checkOn: [ 'projectId', 'active' ],
        input: (adm: ActionDataManager) => ({
            projectId: adm.input.projectId,
            active: true,
        })
    })
    async _exec() {}
}