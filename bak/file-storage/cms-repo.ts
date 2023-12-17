import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-cms',
	targetEntity: 'Cms',
})
export default class CmsRepository extends JsonKeyStorage {
	static getCms(cmsId: string) {
		return this.findOneBy(cmsId);
	}

	static async createCms(cmsId: string, updateValues: any) {
		return await this.create(cmsId, updateValues);
	}

	static updateCms(cmsId: string, updateValues: any) {
		return this.update(cmsId, updateValues);
	}

	static getAllCmss() {
		return this.fetchAll();
	}

	static deleteCms(cmsId: string) {
		return this.remove(cmsId);
	}
}
