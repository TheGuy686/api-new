import BaseActionInput from '@eezze/base/BaseActionInput';
import ADM from '@eezze/classes/ActionDataManager';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class DependenciesFromTagsActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ADM) => adm.request.auth?.user?.id,
        message: 'DependenciesFromTagsActionInput "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ADM) => adm.request.urlParams?.tags,
        message: 'DependenciesFromTagsActionInput "tags" was not set',
    })
    tags: string;
}
