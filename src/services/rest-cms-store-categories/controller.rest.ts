import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestCmsResponseCodesController extends RestController {
	@EGet({ path: '/cms/store/categories' }) static async storeCategories() {}
}
