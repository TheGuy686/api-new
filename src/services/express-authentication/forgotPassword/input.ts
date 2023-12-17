import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Email } from '@eezze/decorators/models/types';

@EActionInput()
export default class ForgotPasswordActionInput extends BaseActionInput {
	@Email({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.email,
	})
	email: string;
}