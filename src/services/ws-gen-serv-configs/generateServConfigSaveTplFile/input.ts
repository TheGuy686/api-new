import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateServConfigSaveTplFileActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'GenerateServConfigSaveTplFileActionInput "userId" was not set',
    })
    private userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        message: 'GenerateServConfigSaveTplFileActionInput "projectId" was not set',
    })
    private projectId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.template,
        message: 'GenerateServConfigSaveTplFileActionInput "template" was not set',
    })
    private template: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.type,
        message: 'GenerateServConfigSaveTplFileActionInput "type" was not set',
    })
    private type: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.content ?? '',
        message: 'GenerateServConfigSaveTplFileActionInput "content" was not set',
    })
    private content: string;
}
