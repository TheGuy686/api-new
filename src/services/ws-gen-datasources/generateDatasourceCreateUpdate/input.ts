import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateDatasourceCreateUpdateInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'GenerateDatasourceCreateUpdate "userId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        message: 'GenerateDatasourceCreateUpdate "projectId" was not set',
    })
    projectId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.id,
        message: 'GenerateDatasourceCreateUpdate "id" was not set',
    })
    id: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.previousName,
        message: 'GenerateDatasourceCreateUpdate "previousName" was not set',
    })
    previousName: string;
}
