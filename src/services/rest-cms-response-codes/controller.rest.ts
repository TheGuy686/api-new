import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestCmsResponseCodesController extends RestController {
	@EGet({ path: '/cms/response-code' }) static async readResponseCode() {}

	@EGet({ path: '/cms/response-code/all' }) static async readAllResponseCodes() {}

	@EPost({ path: '/cms/response-code' }) static async createResponseCode() {}

	@EPut({ path: '/cms/response-code' }) static async updateResponseCode() {}

	@EDelete({ path: '/cms/response-code' }) static async deleteResponseCode() {}
}
