import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';

@EActionInput()
export default class CreateDatasourceTypeInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'ServiceConfigurableType "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => getUniqueId(),
		message: 'ServiceConfigurableType "key" was not set',
	})
	key: string;


	@String({
		required: true,
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

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.enabled,
		message: 'ServiceConfigurableType "enabled" was not set',
	})
	enabled: string;
}
