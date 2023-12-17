import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class ReadConnectionActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.id,
		message: 'Connection "id" was not set',
	})
	id: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'Connection "name" was not set',
	})
	name: string;

}