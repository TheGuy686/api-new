import BaseFileStorage from '@eezze/base/datasources/BaseFileStorage';
import { ActionDataManager } from '@eezze/classes';
import { ERepository } from '@eezze/decorators/index';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-project-logo',
	targetEntity: 'ProjectLogo',
})
export default class ProjectLogoRepository extends BaseFileStorage {
	public static saveProjectLogo(adm: ActionDataManager) {
		return this.saveFile(adm.input, adm.input.logo);
	}
}