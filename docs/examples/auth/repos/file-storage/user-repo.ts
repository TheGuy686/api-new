import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators/index';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'json-db-users',
	targetEntity: 'User',
})
export default class UserRepository extends JsonKeyStorage {
	static getUser(userId: string) {
		return this.findOneBy(userId);
	}

	static async createUser(userId: string, updateValues: any) {
		return await this.create(userId, updateValues);
	}

	static updateUser(userId: string, updateValues: any) {
		return this.update(userId, updateValues);
	}

	static getAllUsers() {
		return this.fetchAll();
	}

	static deleteUser(userId: string) {
		return this.remove(userId);
	}
}
