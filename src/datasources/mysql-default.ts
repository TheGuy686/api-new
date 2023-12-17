import { EDataSource } from '@eezze/decorators';

@EDataSource({
    connection: 'ServerDefaultConnection',
    datasourceType: 'Mysql',
    databaseName: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
})
export default class MysqlDefault {}