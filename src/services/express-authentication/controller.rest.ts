import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class ExpressAuthenticationController extends RestController {
	@EGet({path: '/auth/user'})
	static async retrieveAuthUser() {}

	@EPut({path: '/auth/user'})
	static async updateAccount() {}

	@EDelete({path: '/auth/user'})
	static async removeAuthUser() {}

	@EPost({path: '/auth/register'})
	static async registerAuthUser() {}

	@EGet({path: '/auth/verify-email'})
	static async verifyEmail() {}

	@EPost({path: '/auth/login'})
	static async login() {}

	@EPost({path: '/auth/send-verify-account-email'})
	static async sendVerifyAccountEmail() {}

	@EPut({path: '/auth/token'})
	static async refreshToken() {}

	@EPut({path: '/auth/forgot-password'})
	static async forgotPassword() {}

	@EPut({path: '/auth/reset-password'})
	static async resetPassword() {}

	@EPut({path: '/auth/update-password'})
	static async updatePassword() {}

	@EPut({path: '/auth/avatar'})
	static async uploadUserAvatar() {}
}