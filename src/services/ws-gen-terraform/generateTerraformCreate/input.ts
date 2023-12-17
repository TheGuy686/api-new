import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateTerraformCreateInput extends BaseActionInput {

    @String({
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        required: true
    })
    private userId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        required: true,
    })
    private projectId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.connectionId,
        required: true,
    })
    private connectionId: string;

    @String({
        input: (adm: ActionDataManager) => adm.request.requestBody?.connectionType,
        required: true,
    })
    private connectionType: string;
}
