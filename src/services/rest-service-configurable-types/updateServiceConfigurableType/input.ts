import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateServiceConfigurableTypeInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'ServiceConfigurableType "userId" was not set',
	})
	userId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'ServiceConfigurableType "id" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.key,
		message: 'ServiceConfigurableType "key" was not set',
	})
	key: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'ServiceConfigurableType "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'ServiceConfigurableType "description" was not set',
	})
	description: string;

	@Boolean({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.enabled,
		message: 'ServiceConfigurableType "enabled" was not set',
	})
	enabled: boolean;

}
