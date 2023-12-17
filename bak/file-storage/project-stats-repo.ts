import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-project-stats',
	targetEntity: 'ProjectStats',
})
export default class ProjectStatsRepository extends JsonKeyStorage {
}