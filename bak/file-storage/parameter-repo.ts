import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-parameter',
	targetEntity: 'Parameter',
})
export default class ParameterRepository extends JsonKeyStorage {
	static getParameter(parameterId: string) {
		return this.findOneBy(parameterId);
	}

	static async createParameter(parameterId: string, updateValues: any) {
		return await this.create(parameterId, updateValues);
	}

	static updateParameter(parameterId: string, updateValues: any) {
		return this.update(parameterId, updateValues);
	}

	static getAllParameters() {
		return this.fetchAll();
	}

	static deleteParameter(parameterId: string) {
		return this.remove(parameterId);
	}
}
