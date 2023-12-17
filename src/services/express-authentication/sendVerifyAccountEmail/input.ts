import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  Email, String } from '@eezze/decorators/models/types';

@EActionInput()
export default class SendVerifyAccountEmailActionInput extends BaseActionInput {
	@Email({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.email,
		message: 'Email was invalid',
	})
	email: string;
}