import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Email } from '@eezze/decorators/models/types';

@EActionInput()
export default class CreateMemberInput extends BaseActionInput {
	@Email({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.email,
		message: 'Member "email" was not a valid email',
	})
	email: string;

	@String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.teamId,
        message: 'Member "teamId" was not set',
    })
    teamId: string;

	@String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.permission,
        message: 'Member "permission" was not set',
    })
    permission: string;

	@String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.teamId,
        message: 'Member "invitee" was not set',
    })
    invitee: string;
}
