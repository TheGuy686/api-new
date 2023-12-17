import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Json } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';

@EActionInput()
export default class InviteMembersInput extends BaseActionInput {
	@Json({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody.invites,
        message: 'Member "invites" was not set',
    })
    invites: string;
}
