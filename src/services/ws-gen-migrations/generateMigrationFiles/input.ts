import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateMigrationFilesInput extends BaseActionInput {
    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id
    })
    private userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
    })
    private projectId: string;

    @Json({
        required: false,
        input: (adm: ActionDataManager) => adm.request.requestBody?.entities,
    })
    private entities: string;

    @String({
        required: false,
        input: (adm: ActionDataManager) => adm.request.requestBody?.id,
    })
    private id: string;

    @String({
        required: false,
        input: (adm: ActionDataManager) => adm.request.requestBody?.name,
    })
    private name: string;
}
