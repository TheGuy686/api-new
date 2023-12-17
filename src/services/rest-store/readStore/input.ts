import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadStoreActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.storeId,
        message: 'ReadStore "id" was not set',
    })
    id: string;
}
