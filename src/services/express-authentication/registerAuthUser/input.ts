import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Email,  Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class RegisterAuthUserActionInput extends BaseActionInput {
	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.username,
		message: 'User "username" was not set',
	})
	username?: string;

	@Email({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.email,
		message: 'User "email" was not set',
	})
	email?: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.firstName,
		message: 'User "firstName" was not set',
	})
	firstName: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.lastName,
		message: 'User "lastName" was not set',
	})
	lastName: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.password,
		message: 'User "password" was not set',
	})
	password: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.roles ?? [ 'ROLE_USER' ],
		message: 'User "roles" was not set',
	})
	roles: string;
}