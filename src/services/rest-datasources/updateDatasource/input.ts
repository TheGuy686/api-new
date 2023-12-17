import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateDatasourceInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Action "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Datasource "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'Datasource "id" was not set',
	})
	id: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Datasource "type" was not set',
	})
	type: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Datasource "name" was not set',
	})
	name: string;

	@Text({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Datasource "description" was not set',
	})
	description: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.metadata,
		message: 'Datasource "metadata" was not set',
	})
	metadata: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.initModel,
		message: 'Datasource "initModel" was not set',
	})
	initModel: string;
}
