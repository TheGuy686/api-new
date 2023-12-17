import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GetStoreTagsActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.functionDesc,
        message: 'GetStoreTagsActionInput "functionDesc" was not set',
    })
    functionDesc: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.bulletPointDesc,
        message: 'GetStoreTagsActionInput "bulletPointDesc" was not set',
    })
    bulletPointDesc: string;
}
