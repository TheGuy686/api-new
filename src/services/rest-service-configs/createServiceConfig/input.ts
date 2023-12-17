import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean, Json } from '@eezze/decorators/models/types';
import { pj } from '@eezze/libs/ArrayMethods';

@EActionInput()
export default class CreateServiceConfigActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'ServiceConfig "projectId" was not set',
	})
	projectId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'ServiceConfig "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'ServiceConfig "description" was not set',
	})
	description: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'ServiceConfig "type" was not set',
	})
	type: string;

	@Boolean({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.enabled,
		message: 'ServiceConfig "enabled" was not set',
	})
	enabled: boolean;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.metadata,
		message: 'ServiceConfig "metadata" was not set',
	})
	metadata: string;
}