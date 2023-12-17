import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestTestController extends RestController {
	@EPost({ path: '/test' }) static async createTest() {}

	@EGet({ path: '/log/test' }) static async logTest() {}

	@EGet({ path: '/create' }) static async testCreatePackage() {}

	@EPost({ path: '/promise/issue' }) static async promiseIssue() {}
}