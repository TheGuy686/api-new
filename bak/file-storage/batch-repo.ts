import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-batch',
	targetEntity: 'Batch',
})
export default class BatchRepository extends JsonKeyStorage {
	static async createBatch(controllerId: string, updateValues: any) {
		return await this.create(controllerId, updateValues);
	}
}
