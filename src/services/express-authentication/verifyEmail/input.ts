import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';
import { JWTToken, JWTTokenDecoded } from '@eezze/decorators/models/types';

@EActionInput()
export default class VerifyEmailActionInput extends BaseActionInput {
	@JWTToken({
		serializeProperty: false,
		refreshOnValidate: true,
		expiresIn: {hours: 1},
		input: (adm: ActionDataManager) => adm.request.urlParams?.token,
		additionalHeaders: { type: 'verify-token' },
		secret: process.env.JWT_SECRET,
		message: 'Token was invalid',
	})
	idToken?: string;

	@JWTTokenDecoded({
		serialize: (result: any) => {
			return result.decoded.payload;
		}
	})
	idTokenDecoded?: string;
}