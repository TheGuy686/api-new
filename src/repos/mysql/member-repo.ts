import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'Member',
})
export default class MemberRepository extends BaseRepository {
	static async findByMemberId(memberId: number) {
		return await this.findBy({ memberId });
	}

	static async findOneByMemberId(memberId: number) {
		return await this.findOneBy({ memberId });
	}
}