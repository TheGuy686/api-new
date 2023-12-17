import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class DeleteValueStoreInput extends BaseActionInput {
	@String({
		// required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Value Store "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
		message: 'Value Store "projectId" was not set',
	})
	projectId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.urlParams?.id,
		message: 'Value Store "id" was not set',
	})
	id: string;
}
