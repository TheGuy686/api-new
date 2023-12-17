import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-repgen',
	targetEntity: 'Repgen',
})
export default class RepgenRepository extends JsonKeyStorage {
	static getRepgen(key: string) {
		return this.findOneBy(key);
	}

	static async createRepgen(key: string, updateValues: any) {
		return await this.create(key, updateValues);
	}

	static updateRepgen(key: string, updateValues: any) {
		return this.update(key, updateValues);
	}

	static getAllEntities() {
		return this.fetchAll();
	}

	static deleteRepgen(key: string) {
		return this.remove(key);
	}
}
