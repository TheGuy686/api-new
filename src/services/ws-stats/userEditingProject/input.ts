import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class UserEditingProjectActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        message: 'UserEditingProject "projectId" was not set',
    })
    projectId: string;
}
