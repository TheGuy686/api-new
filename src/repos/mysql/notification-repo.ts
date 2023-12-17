import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'Notification',
})
export default class NotificationRepository extends BaseRepository {
	static async findByUserId(userId: number) {
		return await this.findBy({ userId });
	}

	static async findOneByUserId(userId: number) {
		return await this.findOneBy({ userId });
	}

	static async findByAttribute(attribute: string) {
		return await this.findBy({ attribute });
	}

	static async findOneByAttribute(attribute: string) {
		return await this.findOneBy({ attribute });
	}
}