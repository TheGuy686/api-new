import { EDataSource } from '@eezze/decorators';

@EDataSource({
	datasourceType: 'FileStorage',
	rootPath: process.env.PROJECTS_FILE_ROOT,
	fileType: 'json',
	fileName: 'users.json',
})
export default class JsonDbAction {}
