import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateAccountActionInput extends BaseActionInput {
	@String({
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'User "id" was not set',
	})
	id?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.firstName,
		message: 'User "firstName" was not set',
	})
	firstName?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.lastName,
		message: 'User "lastName" was not set',
	})
	lastName?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.handle,
		message: 'User "handle" was not set',
	})
	handle?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.avatar,
		message: 'User "avatar" was not set',
	})
	avatar?: string;
}