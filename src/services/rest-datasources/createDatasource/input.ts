import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateDatasourceInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'CreateDatasourceInput "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'CreateDatasourceInput "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'CreateDatasourceInput "type" was not set',
	})
	type: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'CreateDatasourceInput "name" was not set',
	})
	name: string;

	@Text({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'CreateDatasourceInput "description" was not set',
	})
	description: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.metadata,
		message: 'CreateDatasourceInput "metadata" was not set',
	})
	metadata: string;
}
