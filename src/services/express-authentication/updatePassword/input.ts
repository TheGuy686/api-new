import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Password, PasswordConfirm } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdatePasswordActionInput extends BaseActionInput {
	@Password({
		required: true,
		serializeProperty: true,
		isTransient: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.password,
	})
	password: string;

	@PasswordConfirm({
		required: true,
		serializeProperty: false,
		isTransient: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.passwordConfirm,
		passwordProperty: 'password',
	})
	passwordConfirm: string;
}