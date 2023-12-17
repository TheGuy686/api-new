import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';

@EActionInput()
export default class CreateProjectInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Action "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		bindProps: ['key'],
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectName,
		message: 'Project "projectName" was not set',
	})
	projectName?: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.details,
		message: 'Project "details" was not set',
	})
	details?: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.handle,
		message: 'Project "handle" was not set',
	})
	handle?: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.industry,
		message: 'Project "industry" was not set',
	})
	industry?: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.icon,
	})
	icon: string;

	@Boolean()
	overwriteFile: boolean = true;
}
