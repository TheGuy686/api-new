import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'Team',
})
export default class TeamRepository extends BaseRepository {
	static async findByTeamId(teamId: number) {
		return await this.findBy({ teamId });
	}

	static async findOneByTeamId(teamId: number) {
		return await this.findOneBy({ teamId });
	}
}