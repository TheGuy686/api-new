import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class TransformDsEntitiesActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'TransformDsEntitiesActionInput "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
		message: 'TransformDsEntitiesActionInput "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.id,
		message: 'TransformDsEntitiesActionInput "id" was not set',
	})
	id: string;
}
