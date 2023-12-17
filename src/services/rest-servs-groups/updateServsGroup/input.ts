import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateServsGroupInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Service Group "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Service Group "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'Service Group "id" was not set',
	})
	id: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Service Group "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Service Group "description" was not set',
	})
	description: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.roles ?? [],
		message: 'Service Group "roles" was not set',
	})
	roles: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.totalServices,
		message: 'Service Group "totalServices" was not set',
	})
	totalServices: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.metadata,
		message: 'Service "metadata" was not set',
	})
	metadata: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Service "type" was not set',
	})
	type: string;
}
