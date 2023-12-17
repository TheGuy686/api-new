import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class PromiseIssueInput extends BaseActionInput {
	@String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.id,
        message: 'Service "id" was not set',
    })
    id: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id ?? 1,
        required: true,
        message: 'Service "userId" was not set',
    })
    private userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: true,
        message: 'Service "projectId" was not set',
    })
    private projectId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.serviceGroupId,
        required: true,
        message: 'Service "serviceGroupId" was not set',
    })
    private serviceGroupId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.type,
        required: true,
        message: 'Service "type" was not set',
    })
    private type: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.description,
        required: false
    })
    private description: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.name,
        required: true,
        message: 'Service "name" was not set',
    })
    private name: string;

    @Json({
        input: (adm: ActionDataManager) => adm.request.requestBody?.definition,
        required: true,
        message: 'Service "definition" was not set',
    })
    private definition: string;

    @Json({
        input: (adm: ActionDataManager) => adm.request.requestBody?.logic,
        required: true,
        message: 'Service "logic" was not set',
    })
    private logic: string;

    @Json({
        input: (adm: ActionDataManager) => adm.request.requestBody?.actionInput,
        required: true,
        message: 'Service "actionInput" was not set',
    })
    private actionInput: string;
}
