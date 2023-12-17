import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';


@EActionInput()
export default class CreateValueStoreInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Value Store "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Value Store "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.key,
		message: 'Value Store "key" was not set',
	})
	key: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type ?? 'text',
		message: 'Value Store "type" was not set',
	})
	type: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.value,
		message: 'Value Store "value" was not set',
	})
	value: string;
}
