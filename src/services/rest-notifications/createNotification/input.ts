import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateNotificationInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.userId,
		message: 'Notification "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Notification "type" was not set',
	})
	type: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => 'pending',
		message: 'Notification "status" was not set',
	})
	status: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.title,
		message: 'Notification "title" was not set',
	})
	title: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.message,
		message: 'Notification "message" was not set',
	})
	message: string;

	@String({
		input: (adm: ActionDataManager) => new Date()
	})
	createdAt: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.auth.user.id,
	})
	createdBy: string;
}
