import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestConnectionsController extends RestController {
	@EGet({path: '/connection/all'})
	static async readAllConnections() {}

	@EPost({path: '/connection'})
	static async createConnection() {}

	@EGet({path: '/connection'})
	static async readConnection() {}

	@EPut({path: '/connection'})
	static async updateConnection() {}

	@EDelete({path: '/connection'})
	static async deleteConnection() {}

	@EPut({path: '/connection/state'})
	static async storeState() {}
}