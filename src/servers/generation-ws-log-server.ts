import Logger from '@eezze/classes/Logger';
import { ActionDataManager } from '@eezze/classes';
import { WSLoggingServer } from '@eezze/decorators';

@WSLoggingServer({
    logger: new Logger('generation_ws_logging_server'),
    connection: 'ServerDefaultConnection',
    port: process.env.DEFAULT_WS_LOGGING_SERVER_PORT,
    path: '/v1',
    healthCheckPort: process.env.DEFAULT_WS_LOGGING_SERVER_ES_PORT,
})
export default class GenerationWsLogServer {}

// trustedOrigins: [
//     System.ip(),
//     process.env.HOST_IP,
//     'localhost',
//     '0.0.0.0'
// ]