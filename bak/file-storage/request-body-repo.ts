import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-requestbody',
	targetEntity: 'RequestBody',
})
export default class RequestBodyRepository extends JsonKeyStorage {
	static getRequestBody(requestBodyId: string) {
		return this.findOneBy(requestBodyId);
	}

	static async createRequestBody(requestBodyId: string, updateValues: any) {
		return await this.create(requestBodyId, updateValues);
	}

	static updateRequestBody(requestBodyId: string, updateValues: any) {
		return this.update(requestBodyId, updateValues);
	}

	static getAllRequestBodys() {
		return this.fetchAll();
	}

	static deleteRequestBody(requestBodyId: string) {
		return this.remove(requestBodyId);
	}
}
