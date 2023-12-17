import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class StoreCategoryModulesActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.category,
        message: 'StoreCategoryModules "category" was not set',
    })
    category: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.urlParams?.subcategory,
        message: 'StoreCategoryModules "subcategory" was not set',
    })
    subcategory: string;
}
