import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Boolean } from '@eezze/decorators/models/types';
import { kebabCase } from '@eezze/libs/StringMethods';

@EActionInput()
export default class CreateBlActionTypeInput extends BaseActionInput {

	@String({
		required: true,
		input: (adm: ActionDataManager) => kebabCase(adm.request.requestBody?.title),
		message: 'BlActionType "key" was not set',
	})
	key: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.title,
		message: 'BlActionType "title" was not set',
	})
	title: string;
}
