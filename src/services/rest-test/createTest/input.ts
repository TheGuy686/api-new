import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateTestInput extends BaseActionInput {
	/*
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.actionId,
		message: 'Test "actionId" was not set',
	})
	actionId: string;

	@String({
		// required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Test "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Test "projectId" was not set',
	})
	projectId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Test "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.serviceId,
		message: 'Test "serviceId" was not set',
	})
	serviceId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.operationId,
		message: 'Test "operationId" was not set',
	})
	operationId: string;

	@Text({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Test "description" was not set',
	})
	description: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.keyValueItems,
		message: 'Test "keyValueItems" was not set',
	})
	keyValueItems: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.formula,
		message: 'Test "formula" was not set',
	})
	formula: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.dateMask,
		message: 'Test "dateMask" was not set',
	})
	dateMask: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.dateValue,
		message: 'Test "dateValue" was not set',
	})
	dateValue: string;
*/

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.image,
		message: 'Test "image" was not set',
	})
	image: string;
}
