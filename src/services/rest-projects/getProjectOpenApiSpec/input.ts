import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';
import { EActionInput } from '@eezze/decorators';
import { String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GetProjectOpenApiSpecActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
		message: 'GetProjectOpenApiSpecActionInput "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.dsFilter,
		message: 'GetProjectOpenApiSpecActionInput "dsFilter" was not set',
	})
	dsFilter: string;
}
