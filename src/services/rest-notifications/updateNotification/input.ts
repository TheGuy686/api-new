import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateNotificationInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Action "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.notificationId,
		message: 'Controller "notificationId" was not set',
	})
	notificationId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.notifiactionType,
		message: 'Controller "notifiactionType" was not set',
	})
	notifiactionType: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.status,
		message: 'Controller "status" was not set',
	})
	status: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.title,
		message: 'Controller "title" was not set',
	})
	title: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.message,
		message: 'Controller "message" was not set',
	})
	message: string;
}
