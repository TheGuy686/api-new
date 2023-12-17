import { EDataSource } from '@eezze/decorators';

@EDataSource({
    connection: 'ServerDefaultConnection',
    datasourceType: 'ws-integration',
    port: process.env.DEFAULT_WS_STATS_SERVER_PORT,
    path: '/v1',
})
export default class IntergrationEezzeStatsWs {}