import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateLinterActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.key,
		message: 'Linter "key" was not set',
	})
	key: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Linter "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Linter "description" was not set',
	})
	description: string;

	@Boolean({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.enabled,
		message: 'Linter "enabled" was not set',
	})
	enabled: boolean = true;
}