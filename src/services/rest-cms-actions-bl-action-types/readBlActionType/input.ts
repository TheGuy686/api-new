import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadBlActionTypeInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => {
            // console.log('Adm Request Params', adm.request.urlParams);
            return adm.request.urlParams?.id
        },
        message: 'BlActionType "id" was not set',
    })
    id: string;

    @String({
        required: false,
        input: (adm: ActionDataManager) => {
            // console.log('Adm Request Params', adm.request.urlParams);
            return adm.request.urlParams?.key
        },
        message: 'BlActionType "key" was not set',
    })
    key: string;
}
