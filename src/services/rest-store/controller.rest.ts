import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestStoreController extends RestController {
	@EGet({ path: '/admin/store/all/non-approved' }) static async readAllAwaitingApproval() {}

	@EGet({ path: '/store/all' }) static async allUserStoreModules() {}

	@EGet({ path: '/internal/modules/all' }) static async allInternalModules() {}

	@EPost({ path: '/store' }) static async createStore() {}

	@EPost({ path: '/store/review' }) static async addReview() {}

	@EGet({ path: '/store' }) static async readStore() {}

	@EGet({ path: '/store/search' }) static async search() {}

	@EGet({ path: '/store/search-on-tags' }) static async searchOnTags() {}

	@EGet({ path: '/store/tags' }) static async getStoreTags() {}

	@EGet({ path: '/store/modules' }) static async storeCategoryModules() {}

	@EGet({ path: '/store/categories' }) static async storeCategories() {}

	@EGet({ path: '/store/menu-categories' }) static async storeMenuCategories() {}

	@EDelete({ path: '/store' }) static async deleteStore() {}

	@EPut({ path: '/admin/store/publish-module' }) static async publishStoreModule() {}
}
