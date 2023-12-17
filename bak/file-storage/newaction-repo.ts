import JsonKeyStorage from '@eezze/base/datasources/JsonKeyStorage';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-newaction',
	targetEntity: 'Newaction',
})
export default class NewactionRepository extends JsonKeyStorage {
}