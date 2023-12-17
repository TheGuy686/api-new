import Logger from '@eezze/classes/Logger';
import { WSServer } from '@eezze/decorators';
import { ActionDataManager as ADM, LogicChain} from '@eezze/classes';
import StackTraceJs from 'stacktrace-js';

@WSServer({
    connection: 'ServerDefaultConnection',
    authenticator: 'ExpressAuthentication',
    port: process.env.DEFAULT_WS_SERVER_PORT,
    healthCheckPort: process.env.DEFAULT_WS_SERVER_ES_PORT,
    logger: new Logger('generation_ws_server', (adm: ADM) => {
        if (!(adm instanceof ADM)) {
            console.log('ADM FROM RYAN: ', adm);
            console.trace('adm was not the correct instance');
            // console.log(StackTraceJs.get());
            throw `Not an adm instance`;
        }

        if (!(adm.request.requestBody?.projectId ?? adm?.request.urlParams?.projectId)) return {};

        return {
            host: `http://${process.env['HOST_IP']}`,
            port: process.env['DEFAULT_WS_LOGGING_SERVER_PORT'],
            path: '/v1',
            projectId: adm.request.requestBody?.projectId ?? adm?.request.urlParams?.projectId,
        };
    }),
})
export default class GenerationWsServer {}
