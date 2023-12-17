import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateResponseCodeInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'ResponseCode "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'ReponseCode "projectId" was not set',
	})
	projectId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'ResponseCode "name" was not set',
	})
	name: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'ResponseCode "id" was not set',
	})
	id: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.code,
		message: 'ResponseCode "code" was not set',
	})
	code: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'ResponseCode "description" was not set',
	})
	description: string;

	@Boolean({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.enabled,
		message: 'ResponseCode "enabled" was not set',
	})
	enabled: string;
}
