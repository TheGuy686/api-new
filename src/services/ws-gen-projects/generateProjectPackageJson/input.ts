import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateProjectPackageJsonActionInput extends BaseActionInput {
	@String({
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		required: true,
	})
	private userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Project "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectName,
		message: 'Project "projectName" was not set',
	})
	projectName?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.description ?? '',
		message: 'Project "description" was not set',
	})
	description?: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => {
			if (!adm.request.requestBody?.author) {
				return `${adm.request.auth.user?.firstName} ${adm.request.auth.user?.lastName}`;
			}

			return adm.request.requestBody?.author;
		},
		message: 'Project "author" was not set',
	})
	author?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.licence,
		message: 'licence "author" was not set',
	})
	licence?: string;
}
