import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Int } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateProjectActionInput extends BaseActionInput {
	@Int({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'Project "id" was not set',
	})
	id?: string;

	@String({
		required: false,
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
		input: (adm: ActionDataManager) => adm.request.requestBody?.logo,
	})
	logo: string;
}