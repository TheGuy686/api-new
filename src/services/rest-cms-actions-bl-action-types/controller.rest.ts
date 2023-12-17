import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestCmsActionsBlActionTypesController extends RestController {
	@EGet({ path: '/cms/actions/bl-action-type' }) static async readBlActionType() {}

	@EGet({ path: '/cms/actions/bl-action-type/all' }) static async readAllBlActionTypes() {}

	@EPost({ path: '/cms/actions/bl-action-type' }) static async createBlActionType() {}

	@EPut({ path: '/cms/actions/bl-action-type' }) static async updateBlActionType() {}

	@EDelete({ path: '/cms/actions/bl-action-type' }) static async deleteBlActionType() {}
}
