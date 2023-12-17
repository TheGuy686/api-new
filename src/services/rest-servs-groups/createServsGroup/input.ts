import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';


@EActionInput()
export default class CreateServsGroupInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Service "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Service "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Service "description" was not set',
	})
	description: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Service "type" was not set',
	})
	type: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.metadata,
		message: 'Service "metadata" was not set',
	})
	metadata: string;
}
