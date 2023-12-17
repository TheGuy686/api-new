import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Int } from '@eezze/decorators/models/types';

@EActionInput()
export default class DeployProjectActionInput extends BaseActionInput {
	@String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
        message: 'DeployProjectActionInput "userId" was not set',
    })
    userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'DeployProjectActionInput "projectId" was not set',
	})
	projectId?: string;
}