import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-servicepreset',
	targetEntity: 'ServicePreset',
})
export default class ServicePresetRepository extends JsonKeyStorage {
	static getServicePreset(servicePresetId: string) {
		return this.findOneBy(servicePresetId);
	}

	static async createServicePreset(servicePresetId: string, updateValues: any) {
		return await this.create(servicePresetId, updateValues);
	}

	static updateServicePreset(servicePresetId: string, updateValues: any) {
		return this.update(servicePresetId, updateValues);
	}

	static getAllServicePresets() {
		return this.fetchAll();
	}

	static deleteServicePreset(servicePresetId: string) {
		return this.remove(servicePresetId);
	}
}
