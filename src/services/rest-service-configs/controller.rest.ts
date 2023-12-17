import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestServiceConfigsController extends RestController {
	@EGet({path: '/service-config/all'})
	static async readAllServiceConfigs() {}

	@EPost({path: '/service-config'})
	static async createServiceConfig() {}

	@EGet({path: '/service-config'})
	static async readServiceConfig() {}

	@EPut({path: '/service-config'})
	static async updateServiceConfig() {}

	@EDelete({path: '/service-config'})
	static async deleteServiceConfig() {}
}