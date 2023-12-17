import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class SendFeedbackActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'SendFeedback "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.subject,
		message: 'SendFeedback "subject" was not set',
	})
	subject: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.message,
		message: 'SendFeedback "message" was not set',
	})
	message: string;
}
