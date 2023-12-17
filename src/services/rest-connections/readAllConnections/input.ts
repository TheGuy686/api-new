import BaseActionInput from '@eezze/base/BaseActionInput';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';
import { ActionDataManager } from '@eezze/classes';

@EActionInput()
export default class ReadAllConnectionsActionInput extends BaseActionInput {
    @String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
		message: 'Connection "projectId" was not set',
	})
	projectId: string;
}