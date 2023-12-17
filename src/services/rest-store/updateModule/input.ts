import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateModuleActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'UpdateModule "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'UpdateModule "id" was not set',
	})
	id: string;

	@Boolean({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.publishApproved,
		message: 'UpdateModule "publishApproved" was not set',
	})
	publishApproved: string;
}
