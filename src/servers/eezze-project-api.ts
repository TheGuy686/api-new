import Logger from '@eezze/classes/Logger';
import { ActionDataManager as ADM, LogicChain} from '@eezze/classes';
import { ExpressServer } from '@eezze/decorators';
import StackTraceJs from 'stacktrace-js';

@ExpressServer({
    logger: new Logger('eezze_project_api', (adm: ADM) => {
        if (!(adm instanceof ADM)) {
            console.log('ADM FROM RYAN: ', adm);
            console.trace('ryan');
            // console.log(StackTraceJs.get());
            throw `Not an adm instance`;
        }

        if (!adm.request.requestBody?.projectId ?? adm?.request.urlParams?.projectId) {
            return {};
        }

        return {
            host: `http://${process.env['HOST_IP']}`,
            port: process.env['DEFAULT_WS_LOGGING_SERVER_PORT'],
            path: '/v1',
            projectId: adm.request.requestBody?.projectId ?? adm?.request.urlParams?.projectId,
        };
    }),
    connection: 'ServerDefaultConnection',
    port: Number(process.env.DEFAULT_REST_SERVER_PORT),
    staticFolders: [
        {
            folder: `${process.env.PROJECTS_ASSETS_ROOT}/logos`,
            path: '/logos',
        },
        {
            folder: `${process.env.PROJECTS_ASSETS_ROOT}/avatars`,
            path: '/avatars',
        },
    ],
    healthCheckPort: process.env['DEFAULT_REST_SERVER_ES_PORT'],
})
export default class EezzeProjectApi {}
