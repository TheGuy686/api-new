import Logger from '@eezze/classes/Logger';
import { ActionDataManager } from '@eezze/classes';
import { WSServer } from '@eezze/decorators';

@WSServer({
    logger: new Logger('eezze_ws_stats_server'),
    authenticator: 'ExpressAuthentication',
    connection: 'ServerDefaultConnection',
    connectionId: (adm: ActionDataManager) => adm?.request?.auth?.user?.id,
    protocol: 'ws',
    secureProtocol: 'wws',
    port: process.env.DEFAULT_WS_STATS_SERVER_PORT,
    storeState: true,
    storeStateInterval: 1000,
    healthCheckPort: process.env.DEFAULT_WS_STATS_SERVER_ES_PORT,
})
export default class EezzeWsStats {}
