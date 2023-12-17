import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class DeleteStoreServActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'DeleteStoreServ "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.urlParams?.projectId,
		message: 'DeleteStoreServ "projectId" was not set',
	})
	projectId: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.urlParams?.serviceId,
		message: 'DeleteStoreServ "serviceId" was not set',
	})
	serviceId: string;
}
