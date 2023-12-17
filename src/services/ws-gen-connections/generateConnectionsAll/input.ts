import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateConnectionAllInput extends BaseActionInput {
	@String({
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		required: true
	})
	private userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.serviceId,
		message: 'Controller&lt;Array&gt; "serviceId" was not set',
	})
	serviceId: string;
}
