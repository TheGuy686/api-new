import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Json, String } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateConnectionActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Connection "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Connection "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'Connection "description" was not set',
	})
	description: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Connection "type" was not set',
	})
	type: string;

	@Json({
		required: true,
		input: (adm: ActionDataManager) => {
console.log('INPUT: ', adm.input);
			return adm.request.requestBody?.metadata;
		},
		message: 'Connection "metadata" was not set',
	})
	metadata: string;
}