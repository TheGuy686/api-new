import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'Connection',
})
export default class ConnectionRepository extends BaseRepository {
	static async findById(id: number) {
		return await this.findBy({ id });
	}
}