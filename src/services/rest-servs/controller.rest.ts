import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestServsController extends RestController {
	@EGet({ path: '/service/all' }) static async readServAll() {}

	@EPost({ path: '/service' }) static async createServ() {}

	@EPut({ path: '/service' }) static async updateServ() {}

	@EDelete({ path: '/service' }) static async deleteServ() {}
}
