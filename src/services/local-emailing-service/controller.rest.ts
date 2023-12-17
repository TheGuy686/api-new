import { RestController } from '@eezze/base';
import { EController, EPost } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class LocalEmailingServiceController extends RestController {
	@EPost({path: '/send-mail'})
	static async sendMail() {}
}