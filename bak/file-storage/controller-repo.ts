import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-controller',
	targetEntity: 'Controller',
})
export default class ControllerRepository extends JsonKeyStorage {
	static getController(controllerId: string) {
		return this.findOneBy(controllerId);
	}

	static async createController(controllerId: string, updateValues: any) {
		return await this.create(controllerId, updateValues);
	}

	static updateController(controllerId: string, updateValues: any) {
		return this.update(controllerId, updateValues);
	}

	static getAllControllers() {
		return this.fetchAll();
	}

	static deleteController(controllerId: string) {
		return this.remove(controllerId);
	}
}
