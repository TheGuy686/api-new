import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class TransformSgToStoreSgInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'TransformSgToStoreSg "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.id,
		message: 'TransformSgToStoreSg "id" was not set',
	})
	id: string;
}
