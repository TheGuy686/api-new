import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'Role',
})

export default class RoleRepository extends BaseRepository {
	static async findById(id: number) {
		return await this.findBy({ id });
	}
}
