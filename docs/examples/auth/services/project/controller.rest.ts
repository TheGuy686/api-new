import { RestController } from '@eezze/base';
import { EController, EGet, EPost } from '@eezze/decorators';

@EController({
	server: 'eezze-rest-api',
})
export default class ProjectController extends RestController {
	@EPost({path: '/project/test/ryan'})
	static async runTest() {}

	@EPost({path: '/project/test/ryan-2'})
	static async runTest2() {}

	@EPost({path: '/project/login'})
	static async login() {}

	@EPost({path: '/project/register'})
	static async register() {}

	@EPost({path: '/project/reset-password'})
	static async resetPassword() {}
}