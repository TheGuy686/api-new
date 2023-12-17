import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateUpdateStoreServActionInput extends BaseActionInput {
	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'CreateUpdateStoreServ "id" was not set',
	})
	id: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.serviceGroupId,
		message: 'CreateUpdateStoreServ "serviceGroupId" was not set',
	})
	serviceGroupId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'CreateUpdateStoreServ "type" was not set',
	})
	type: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'CreateUpdateStoreServ "name" was not set',
	})
	name: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'CreateUpdateStoreServ "description" was not set',
	})
	description: string;

	@Json({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.definition,
	})
	definition: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.actionInput,
	})
	actionInput: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.logic,
	})
	logic: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.output,
	})
	output: string;
}
