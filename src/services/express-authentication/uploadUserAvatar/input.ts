import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, UID, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UploadUserAvatarActionInput extends BaseActionInput {
	@UID({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.avatar,
	})
	avatar: string;

	@Boolean()
	overwriteFile: boolean = true;
}