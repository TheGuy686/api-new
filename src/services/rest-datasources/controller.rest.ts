import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestDatasourcesController extends RestController {
	@EGet({ path: '/datasource/all' }) static async readDatasourceAll() {}

	@EPost({ path: '/datasource' }) static async createDatasource() {}

	@EPut({ path: '/datasource' }) static async updateDatasource() {}

	@EDelete({ path: '/datasource' }) static async deleteDatasource() {}

	@EPut({ path: '/datasource/entity/all' }) static async updateDatasourceEntities() {}

	@EPut({ path: '/datasource/migration/run' }) static async runDatasourceMigration() {}

	@EGet({ path: '/datasource/entity/all' }) static async transformDsEntities() {}
}
