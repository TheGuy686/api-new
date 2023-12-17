import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateMemberActionInput extends BaseActionInput {
	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'Member "id" was not set',
	})
	id: string;

	@Boolean({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.active,
		message: 'Member "active" was not set',
	})
	active: boolean;
}