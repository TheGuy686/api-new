import { EDataSource } from '@eezze/decorators';

@EDataSource({
    connection: 'ServerDefaultConnection',
    datasourceType: 'rest',
    port: process.env.DEFAULT_FE_SERVER_PORT,
})
export default class IntergrationEezzeFrontEnd {}