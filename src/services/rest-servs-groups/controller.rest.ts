import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestServsGroupsController extends RestController {
	@EGet({ path: '/service-group/all' }) static async readServsGroupAll() {}

	@EGet({ path: '/service-group/store' }) static async transformSgToStoreSg() {}

	@EPost({ path: '/service-group' }) static async createServsGroup() {}

	@EPut({ path: '/service-group' }) static async updateServsGroup() {}

	@EDelete({ path: '/service-group' }) static async deleteServsGroup() {}

	@EPost({ path: '/service-group/publish' }) static async publishServGroup() {}
}
