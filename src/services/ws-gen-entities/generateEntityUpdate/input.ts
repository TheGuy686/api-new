import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateEntityUpdateInput extends BaseActionInput {
    @String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'Action "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Datasource "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.datasourceId,
		message: 'Datasource "datasourceId" was not set',
	})
	datasourceId: string;

	@Json({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.entityItem,
		message: 'Datasource "entityItem" was not set',
	})
	entityItem: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type,
		message: 'Datasource "type" was not set',
	})
	type: string;
}
