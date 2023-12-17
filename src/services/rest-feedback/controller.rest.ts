import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestFeedbackController extends RestController {
	@EPost({ path: '/feedback' }) static async sendFeedback() {}
}
