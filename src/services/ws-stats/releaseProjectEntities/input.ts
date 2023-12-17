import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Int, String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReleaseProjectEntitiesActionInput extends BaseActionInput {
    @Int({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'ReleaseProjectEntities "userId" was not set',
    })
    userId: string;

    @Int({
        required: true,
        input: (adm: ActionDataManager) => {
            if (Number(adm.request.requestBody?.projectId ?? 0) == 0) return;
            return adm.request.requestBody?.projectId;
        },
        message: 'ReleaseProjectEntities "projectId" was not set',
    })
    projectId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.sessionId,
        message: 'ReleaseProjectEntities "sessionId" was not set',
    })
    sessionId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.id,
        message: 'ReleaseProjectEntities "requestId" was not set',
    })
    requestId: string;
}
