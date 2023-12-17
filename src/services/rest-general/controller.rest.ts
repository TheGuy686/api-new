import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestGeneralController extends RestController {
	@EGet({path: '/notification/all'})
	static async allNotifications() {}
}