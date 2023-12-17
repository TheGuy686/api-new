import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'User',
})
export default class UserRepository extends BaseRepository {
	static async findByUserId(id: number) {
		return await this.findBy({ id });
	}

	static async findOneByUserId(id: number) {
		return await this.findOneBy({ id });
	}

	static async findByEmail(email: string) {
		return await this.findBy({ email });
	}

	static async findOneByEmail(email: string) {
		return await this.findOneBy({ email });
	}

	static async findByUsername(username: string) {
		return await this.findBy({ username });
	}

	static async findOneByUsername(username: string) {
		return await this.findOneBy({ username });
	}

	static async findByAttribute(attribute: string) {
		return await this.findBy({ attribute });
	}

	static async findOneByAttribute(attribute: string) {
		return await this.findOneBy({ attribute });
	}

	static async findByEmailVerified(emailVerified: string) {
		return await this.findBy({ emailVerified });
	}

	static async findOneByEmailVerified(emailVerified: string) {
		return await this.findOneBy({ emailVerified });
	}

	static async findByPassword(password: string) {
		return await this.findBy({ password });
	}

	static async findOneByPassword(password: string) {
		return await this.findOneBy({ password });
	}

	static async findByPasswordHash(passwordHash: string) {
		return await this.findBy({ passwordHash });
	}

	static async findOneByPasswordHash(passwordHash: string) {
		return await this.findOneBy({ passwordHash });
	}
}