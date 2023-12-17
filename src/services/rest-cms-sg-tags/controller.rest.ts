import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestCmsSgTagsController extends RestController {
	@EGet({ path: '/cms/sg-tag/all' }) static async sgTagsAll() {}
}
