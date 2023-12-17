import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadResponseCodeInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'ResponseCode "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
        message: 'ResponseCode "projectId" was not set',
    })
    projectId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => {
            // console.log('Adm Request Params', adm.request.urlParams);
            return adm.request.urlParams?.id
        },
        message: 'ResponseCode "id" was not set',
    })
    id: string;
}
