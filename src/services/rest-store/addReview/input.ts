import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class AddReviewActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.store,
		message: 'AddReviewActionInput "store" was not set',
	})
	store: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'AddReviewActionInput "reviewer" was not set',
	})
	reviewer: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.rating,
		message: 'AddReviewActionInput "rating" was not set',
	})
	rating: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.comment,
		message: 'AddReviewActionInput "comment" was not set',
	})
	comment: string;
}
