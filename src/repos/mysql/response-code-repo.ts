import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'ResponseCode',
})
export default class ResponseCodeRepository extends BaseRepository {
	static async findById(id: number) {
		return await this.findBy({ id });
	}
}