import { BaseRepository } from '@eezze/base';
import { ERepository } from '@eezze/decorators';

@ERepository({
	datasourceType: 'Mysql',
	datasource: 'mysql-default',
	targetEntity: 'StoreServiceValueStore',
})
export default class StoreServiceValueStoreRepository extends BaseRepository {}