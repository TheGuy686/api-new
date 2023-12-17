import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestStoreServsController extends RestController {
	@EPost({ path: '/store/service' }) static async createUpdateStoreServ() {}

	@EDelete({ path: '/store/service' }) static async deleteStoreServ() {}
}
