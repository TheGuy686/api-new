import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateServiceConfigActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'UpdateServiceConfigActionInput "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'UpdateServiceConfigActionInput "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'UpdateServiceConfigActionInput "id" was not set',
	})
	id: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'UpdateServiceConfigActionInput "description" was not set',
	})
	description: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'UpdateServiceConfigActionInput "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'UpdateServiceConfigActionInput "type" was not set',
	})
	type: string;

	@Boolean({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.enabled,
		message: 'UpdateServiceConfigActionInput "enabled" was not set',
	})
	enabled: boolean;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.metadata,
		message: 'UpdateServiceConfigActionInput "metadata" was not set',
	})
	metadata: string;
}