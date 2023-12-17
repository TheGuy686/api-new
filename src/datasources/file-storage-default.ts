import { EDataSource } from '@eezze/decorators';

@EDataSource({
    connection: 'ServerDefaultConnection',
    datasourceType: 'FileStorage',
    rootPath: process.env.PROJECTS_FILE_ROOT,
})
export default class FileStorageDefault {}