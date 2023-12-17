import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  Int, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class ProjectChannelActionInput extends BaseActionInput {
    @Int({
        required: true,
        input: (adm: ActionDataManager) => {
            if (Number(adm.request.requestBody?.projectId ?? 0) == 0) return;
            return adm.request.requestBody?.projectId;
        },
        message: 'UserEditingProject "projectId" was not set',
    })
    projectId: string;
}
