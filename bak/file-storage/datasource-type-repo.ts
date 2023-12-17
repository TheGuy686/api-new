import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-datasourcetype',
	targetEntity: 'DatasourceType',
})
export default class DatasourceTypeRepository extends JsonKeyStorage {
	static getDatasourceType(datasourceTypeId: string) {
		return this.findOneBy(datasourceTypeId);
	}

	static async createDatasourceType(datasourceTypeId: string, updateValues: any) {
		return await this.create(datasourceTypeId, updateValues);
	}

	static updateDatasourceType(datasourceTypeId: string, updateValues: any) {
		return this.update(datasourceTypeId, updateValues);
	}

	static getAllDatasourceTypes() {
		return this.fetchAll();
	}

	static deleteDatasourceType(datasourceTypeId: string) {
		return this.remove(datasourceTypeId);
	}
}
