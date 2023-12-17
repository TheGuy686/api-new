import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Email,  String } from '@eezze/decorators/models/types';

@EActionInput()
export default class LoginActionInput extends BaseActionInput {
	@Email({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.email,
	})
	protected email: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.password,
	})
	protected password: string;
}