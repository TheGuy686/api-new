import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'Project',
})
export default class ProjectRepository extends BaseRepository {
	static async findByProjectId(projectId: number) {
		return await this.findBy({ projectId });
	}

	static async findOneByProjectId(projectId: number) {
		return await this.findOneBy({ projectId });
	}

    static async findByProjectname(projectname: string) {
		return await this.findBy({ projectname });
	}

	static async findOneByProjectname(projectname: string) {
		return await this.findOneBy({ projectname });
	}
}