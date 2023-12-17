import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { JWTToken, JWTTokenDecoded } from '@eezze/decorators/models/types';

@EActionInput()
export default class RefreshTokenActionInput extends BaseActionInput {
	@JWTToken({
		serializeProperty: false,
		refreshOnValidate: true,
		secret: process.env.JWT_SECRET,
		expiresIn: { hours: 15 },
		input: (adm: ActionDataManager) => adm.request.requestBody?.refreshToken,
		additionalHeaders: {type: 'refresh-token'},
		message: 'Token was invalid',
	})
	refreshToken?: string;

	@JWTTokenDecoded({
		serialize: (result: any) => ({
			idToken: result?.idToken,
			refreshToken: result?.refreshToken,
		})
	})
	refreshTokenDecoded?: string;
}