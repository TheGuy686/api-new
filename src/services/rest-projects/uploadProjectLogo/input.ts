import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, UID, Boolean } from '@eezze/decorators/models/types';

@EActionInput()
export default class UploadProjectLogoActionInput extends BaseActionInput {
	@UID({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.logo,
	})
	logo: string;

	@Boolean()
	overwriteFile: boolean = true;
}