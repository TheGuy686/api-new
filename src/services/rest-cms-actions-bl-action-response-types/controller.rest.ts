import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestCmsActionsBlActionResponseTypesController extends RestController {
	@EGet({ path: '/cms/actions/bl-action-response-type' }) static async readBlActionResponseType() {}

	@EGet({ path: '/cms/actions/bl-action-response-type/all' }) static async readAllBlActionResponseTypes() {}

	@EPost({ path: '/cms/actions/bl-action-response-type' }) static async createBlActionResponseType() {}

	@EPut({ path: '/cms/actions/bl-action-response-type' }) static async updateBlActionResponseType() {}

	@EDelete({ path: '/cms/actions/bl-action-response-type' }) static async deleteBlActionResponseType() {}
}
