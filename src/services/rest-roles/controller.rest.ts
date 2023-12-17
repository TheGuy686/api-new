import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestRolesController extends RestController {
	@EGet({path: '/role/all'})
	static async readAllRoles() {}

	@EPost({path: '/role'})
	static async createRole() {}

	@EGet({path: '/role'})
	static async readRole() {}

	@EPut({path: '/role'})
	static async updateRole() {}

	@EDelete({path: '/role'})
	static async deleteRole() {}
}