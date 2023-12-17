import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateServActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Service "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.serviceGroupId,
		message: 'Service "serviceId" was not set',
	})
	serviceGroupId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Service "serviceGroupId" was not set',
	})
	type: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
	})
	description: string;

	@Json({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.definition,
	})
	definition: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.actionInput,
	})
	actionInput: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.logic,
	})
	logic: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.output,
	})
	output: string;
}
