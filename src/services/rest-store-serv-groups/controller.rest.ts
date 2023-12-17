import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestStoreServiceConfigsController extends RestController {
	@EPost({path: '/store/service-config'})
	static async createUpdateStoreServiceConfig() {}

	// @EGet({path: '/store/service-config'})
	// static async readStoreServiceConfig() {}

	@EDelete({path: '/store/service-config'})
	static async deleteStoreServiceConfig() {}
}