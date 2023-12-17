import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestServiceConfigurableTypesController extends RestController {
	@EGet({ path: '/service-configurable-type' }) static async readServiceConfigurableType() {}

	@EGet({ path: '/service-configurable-type/all' }) static async readAllServiceConfigurableTypes() {}

	@EPost({ path: '/service-configurable-type' }) static async createServiceConfigurableType() {}

	@EPut({ path: '/service-configurable-type' }) static async updateServiceConfigurableType() {}

	@EDelete({ path: '/service-configurable-type' }) static async deleteServiceConfigurableType() {}
}
