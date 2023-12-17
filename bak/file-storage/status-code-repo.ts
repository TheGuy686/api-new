import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-statuscode',
	targetEntity: 'StatusCode',
})
export default class StatusCodeRepository extends JsonKeyStorage {
	static getStatusCode(statusCodeId: string) {
		return this.findOneBy(statusCodeId);
	}

	static async createStatusCode(statusCodeId: string, updateValues: any) {
		return await this.create(statusCodeId, updateValues);
	}

	static updateStatusCode(statusCodeId: string, updateValues: any) {
		return this.update(statusCodeId, updateValues);
	}

	static getAllStatusCodes() {
		return this.fetchAll();
	}

	static deleteStatusCode(statusCodeId: string) {
		return this.remove(statusCodeId);
	}
}
