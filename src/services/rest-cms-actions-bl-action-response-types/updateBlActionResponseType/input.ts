import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateBlActionResponseTypeInput extends BaseActionInput {
	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'BlActionResponseType "id" was not set',
	})
	id: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.key,
		message: 'BlActionResponseType "key" was not set',
	})
	key: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.title,
		message: 'BlActionResponseType "title" was not set',
	})
	title: string;
}
