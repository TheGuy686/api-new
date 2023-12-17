import { EAction, GetOneAndUpdate, } from '@eezze/decorators';
import { BaseActionI } from '@eezze/interfaces';
import { BaseAction } from '@eezze/base';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User'
})
export default class RemoveAuthUserAction extends BaseAction implements BaseActionI {
    // @DeleteOne({
    //     checkOn: ['id'],
    //     input(adm: ActionDataManager) {
    //         return {
    //             id: adm.input.id
    //         }
    //     }
    // })
    @GetOneAndUpdate({
        checkOn: ['id'],
        maximumDepth: 0,
        input: (adm: ActionDataManager) => {
            return {
                id: adm.input.id
            }
        },
        withValues: (adm: ActionDataManager) => {
            return {
                active: false,
            }
        }
    })
    async _exec() {}
}