import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-combine',
	targetEntity: 'Combine',
})
export default class CombineRepository extends JsonKeyStorage {
	static getCombine(controllerId: string) {
		return this.findOneBy(controllerId);
	}

	static async createCombine(controllerId: string, updateValues: any) {
		return await this.create(controllerId, updateValues);
	}

	static updateCombine(controllerId: string, updateValues: any) {
		return this.update(controllerId, updateValues);
	}

	static getAllCombines() {
		return this.fetchAll();
	}

	static deleteCombine(controllerId: string) {
		return this.remove(controllerId);
	}
}
