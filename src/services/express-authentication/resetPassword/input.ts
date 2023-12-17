import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  JWTToken, JWTTokenDecoded, Password, PasswordConfirm } from '@eezze/decorators/models/types';

@EActionInput()
export default class ResetPasswordActionInput extends BaseActionInput {
	@JWTToken({
		serializeProperty: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.token,
		message: 'Token was invalid',
	})
	token?: string;

	@JWTTokenDecoded({
		serializePropsToOutput: true,
		serialize: (result: any) => ({ id: result?.id }),
	})
	tokenDecoded?: string;

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