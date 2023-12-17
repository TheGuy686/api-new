import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class SearchOnTagsActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => (adm.request.urlParams?.term ?? '').replace(/-/g, ' '),
        message: 'SearchOnTagsActionInput "term" was not set',
    })
    term: string;
}
