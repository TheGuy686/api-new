import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadServiceConfigurableTypeInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'ServiceConfigurableType "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.key,
        message: 'ServiceConfigurableType "key" was not set',
    })
    key: string;
}
