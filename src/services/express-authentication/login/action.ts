import { EAction, SocketAction, GetOne, Success, Error, Do, Login } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    targetRepo: 'Mysql.User',
})
export default class LoginAction extends BaseAction {
	@GetOne({
		checkOn: [ 'email' ],
		maximumDepth: 0,
		failOnEmpty: true,
		errorMessage: 'no-credentials-match-found',
	})
	@Login({
		authenticator: 'ExpressAuthentication',
		type: 'jwt',
		successMessage: 'login-success',
		errorMessage: 'no-credentials-match-found',
		secret: process.env.JWT_SECRET,
		expiresIn: { minutes: 15 },
		password: (adm: ADM) => adm.input?.password,
		verifier: (adm: ADM) => adm.result?.verifier,
		input: (adm: ADM) => adm.result,
		failOn: [
			{
				condition: (adm: ADM) => !adm.result?.emailVerified,
				message: 'please-verify-email',
			},
			{
				condition: (adm: ADM) => !adm.result?.active,
				message: 'please-reactivate-account',
			},
		],
	})
	@SocketAction({
		asynchronous: true,
		urlParams: (adm: ADM) => ({
			token: adm.result.token
		}),
		datasource: 'integration-eezze-stats-ws',
		eventName: 'user-logged-in',
		requestBody: (adm: ADM) => {
			const usr = adm.action(0).result;

			return {
				id: usr.id,
				email: usr.email,
				username: usr.username,
				firstName: usr.firstName,
				lastName: usr.lastName,
				emailVerified: usr.emailVerified,
				roles: usr.roles,
				active: usr.active,
			};
		},
	})
	async _exec() {}

	@Success()
	_success(adm: ADM) {
		adm.setResult({ ...adm.action(1).result }, 'login-success');
	}
}