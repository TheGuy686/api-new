import BaseFileStorage from '@eezze/base/datasources/BaseFileStorage';
import { ActionDataManager } from '@eezze/classes';
import { ERepository } from '@eezze/decorators/index';

@ERepository({
	datasourceType: 'FileStorage',
	datasource: 'file-storage-user-avatar',
	targetEntity: 'UserAvatar',
})
export default class UserAvatarRepository extends BaseFileStorage {
}