import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestValueStoreController extends RestController {
	@EGet({ path: '/value-store/all' }) static async valueStoreAll() { }

	@EPost({ path: '/value-store' }) static async createValueStore() { }

	@EPut({ path: '/value-store' }) static async updateValueStore() { }

	@EDelete({ path: '/value-store' }) static async deleteValueStore() { }
}
