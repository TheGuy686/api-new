import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';

@EActionInput()
export default class CreateTeamInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Team "userId" was not set',
	})
	userId: string;

	@String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        message: 'Team "projectId" was not set',
    })
    projectId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Team "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Team "description" was not set',
	})
	description: string;
}
