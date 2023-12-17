import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';
import { JWTToken, JWTTokenDecoded } from '@eezze/decorators/models/types';

@EActionInput()
export default class AcceptInvitationActionInput extends BaseActionInput {
	@JWTToken({
		serializeProperty: false,
		refreshOnValidate: true,
		expiresIn: {hours: 1},
		input: (adm: ActionDataManager) => adm.request.urlParams?.token,
		additionalHeaders: {type: 'accept-member-invitation'},
		message: 'Token was invalid',
	})
	idToken?: string;

	@JWTTokenDecoded({
		serialize: (result: any) => result.decoded.payload
	})
	idTokenDecoded?: string;
}