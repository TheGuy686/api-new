import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'StoreServiceConnection',
})
export default class StoreServiceConnectionRepository extends BaseRepository {
	static async findById(id: number) {
		return await this.findBy({ id });
	}
}