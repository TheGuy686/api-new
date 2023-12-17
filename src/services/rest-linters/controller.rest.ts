import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestLintersController extends RestController {
	@EGet({path: '/cms/linter/all'})
	static async readAllLinters() {}

	@EPost({path: '/cms/linter'})
	static async createLinter() {}

	@EGet({path: '/cms/linter'})
	static async readLinter() {}

	@EPut({path: '/cms/linter'})
	static async updateLinter() {}

	@EDelete({path: '/cms/linter'})
	static async deleteLinter() {}
}