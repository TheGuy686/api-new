import { serializeUrl } from '../libs/HttpMethods';
import { ucFirst } from '../libs/StringMethods';
import { getLogger } from '..';
import Request from '../classes/Request';
import ProjectDependancyCaches from './ProjectDependancyCaches';
import ActionDataManager from './ActionDataManager';

type SERVICE_TYPE = 'restful' | 'websocket';

interface RESTFUL_SERVICE {
    type: SERVICE_TYPE;
    method: RESTFUL_METHODS;
    path: string;
    showUploadFeedBackCb?: Function;
}

interface WEBSCOKET_SERVICE {
    type: SERVICE_TYPE;
    eventType: string;
    method: RESTFUL_METHODS;
    channel?: string;
    event: string;
    success?: string;
    fail?: string;
}

type SERVICE = RESTFUL_SERVICE | WEBSCOKET_SERVICE;

export interface SERVICE_PAYLOADS {
    headers?: any;
    urlParams?: any;
    requestBody?: any;
}

function emit(socket: any, event: string, data: any) {
    socket.send(JSON.stringify({
        event,
        data
    }));
}

export default class ServiceBus {
    private static _services: {
        [serviceKey: string]: {
            [methodKey: string]: any;
        }
    } = {};

    public static get services() { return this._services}

    public static getService(serviceKey: string) {
        if (typeof this._services[serviceKey] != 'object') {
            throw `ServiceBus->Error: Service Properties didn't exist for service "${serviceKey}"`;
        }
        return this._services[serviceKey];
    }

    public static registerService(
        serviceKey: string,
        serviceConfig: any,
        methodKey: string,
        service: RESTFUL_SERVICE | WEBSCOKET_SERVICE,
    ) {
        serviceKey = ucFirst(serviceKey.replace(/Controller$/, '').replace(/Service$/, '') + 'Service');

        if (typeof this._services[serviceKey] == 'undefined') {
            this._services[serviceKey] = {};
        }

        try {
            this._services[serviceKey][methodKey] = {
                config: serviceConfig,
                service,
            };
        }
        catch (e) {
            console.log(e);
            console.error(`ServiceBus->registerService: Could not register service ${serviceKey}:${methodKey} type: ${service.type}: ${e.message}`);
        }
    }

    public static async exec(
        serviceKey: string,
        opperationKey: string,
        payload: SERVICE_PAYLOADS = {},
        debug: boolean = false,
        adm: ActionDataManager,
    ) {
        if (typeof this._services?.[serviceKey] == 'undefined') {
            console.log('Cached Services: ', serviceKey, ' : ', Object.keys(this._services));
            throw new Error(`ServiceBus->exec: Requested service does not exist`);
        }

        if (typeof this._services?.[serviceKey]?.[opperationKey] == 'undefined') {
            throw new Error(`ServiceBus->exec: Requested service opperation key "${serviceKey}" does not exist`);
        }

        const logger = getLogger();
        const controllerConfig = ProjectDependancyCaches.getControllerArgsForService(opperationKey);
        const serviceObj: any = this._services[serviceKey][opperationKey];
        const service: any = serviceObj.service;

        if (typeof controllerConfig?.server == 'undefined') {
            throw new Error(`controllerConfig["server"] didn't exist for: ${JSON.stringify(controllerConfig)}`);
        }

        let server: any = ProjectDependancyCaches.getServerConfigs(
            controllerConfig.server,
        ), url: string;

        try {
            switch (service.type as SERVICE_TYPE) {
                case 'restful':
                    url = serializeUrl(
                        server.conObj.externalUrl + (typeof server?.port == 'number' ? `:${ server?.port }` : ''),
                        service.path as string,
                        payload?.urlParams ?? {}
                    ) as string;

                    if (debug) {
                        logger.debugI(`Doing REST request to "${url}"`);
                        logger.debugI(`Request Headers: "${JSON.stringify(payload?.headers ?? {}, null, 4)}"`);
                        logger.debugI(`Request Body: "${JSON.stringify(payload?.requestBody ?? {}, null, 4)}"`);
                    }

                    return await Request[service.method as RESTFUL_METHODS](
                        url,
                        payload?.requestBody,
                        undefined,
                        payload?.headers,
                        { logger, adm }
                    );

                case 'websocket':
                    // url = serializeUrl(
                    //     `ws://${server.host}${server.port ? `:${server.port}` : ''}`,
                    //     service.path as string,
                    //     payload?.urlParams ?? {}
                    // ) as string;

                    url = (serializeUrl(
                        server.conObj.externalUrl,
                        service.path as string,
                        payload?.urlParams ?? {},
                    ) as string).replace('http:', 'ws:').replace('https:', 'wss:');

                    if (debug) {
                        logger.debugI(`Doing SOCKET request to "${url}"`);
                        logger.debugI(`Event Name: "${service.event}"`);
                        logger.debugI(`Request Body: "${JSON.stringify(payload?.requestBody ?? {}, null, 4)}"`);
                    }

                    const internalError = {
                        statusCode: 500,
                        success: false,
                        data: {
                            error: 'Internal error',
                        },
                    };

                    return await new Promise((resolve: Function, reject: Function) => {
                        const WS = require('websocket').w3cwebsocket;
                        const ws = new WS(url);

                        ws.onopen = () => {
                            logger.warnI(`Connected to: ${url}`);

                            emit(ws, service.event, JSON.parse(JSON.stringify(payload?.requestBody)));

                            ws.onmessage = (e: any) => {
                                try {
                                    const res = JSON.parse(e.data);

                                    ws.close();
                                    resolve(res.data);
                                }
                                catch (e) {
                                    resolve(internalError);
                                }
                            };
                        };

                        ws.onerror = function() {
                            this.logger.errorI(`Connection error: ${url}`, 'ServiceBus: websocket: exec');
                            resolve(internalError);
                        };
                    });
            }
        }
        catch (e) { throw e }
    }
}

export async function Service(key: string, payload: SERVICE_PAYLOADS = {}, debug: boolean = false, adm: ActionDataManager) {
    if (!/^.*?\:.*?$/.test(key)) {
        throw new Error(`Badly formed key. Expected "^.*?\:.*?$", for e.g: UserService:updateUser`);
    }
    const bits = key.split(':');
    return await ServiceBus.exec(bits[0], bits[1], payload, debug, adm);
}