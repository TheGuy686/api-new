import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Int } from '@eezze/decorators/models/types';

@EActionInput()
export default class RetrieveAuthUserActionInput extends BaseActionInput {
	@Int({
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'User "id" was not set',
	})
	id: number;
}