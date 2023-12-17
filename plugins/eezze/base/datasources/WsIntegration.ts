import { serializeUrl } from '../../libs/HttpMethods';
import { ActionDataManager, Logger } from '../../classes';

function emit(socket: any, event: string, data: any) {
    socket.send(JSON.stringify({
        event,
        data
    }));
}

export default class WsIntegration {
    private logger: Logger;
    private host: string;
    private headers: object = {};
    private adm: ActionDataManager;

    static async doAction(
        ds: any,
        params: any,
        headers: any,
        payload: any,
        urlParams: any,
        target: any,
        adm: ActionDataManager,
    ) {
        const wsIntegration = new WsIntegration(
            target.logger,
            ds.host,
            adm,
            headers,
        );
    
        const onSuccessEvent = typeof params?.success !== 'undefined' ? params?.success : `${params?.eventName}-success`,
            onErrorEvent = typeof params?.error !== 'undefined' ? params?.error : `${params?.eventName}-error`;
    
        const res: any = await wsIntegration.run(
            params.eventName,
            payload,
            onSuccessEvent,
            onErrorEvent,
            urlParams,
            params?.asynchronous,
        );
    
        return res;
    }

    constructor(logger: Logger, host: string, adm: ActionDataManager, headers?: object) {
        this.logger = logger;
        this.host = host;
        this.adm = adm;

        if (typeof headers != 'undefined') this.headers = headers;
    }

    async run(emitEvent: string, payload?: object, onSuccessEvent?: string, onErrorEvent?: string, urlParams?: object, asynchronous: boolean = false) {
        return await new Promise((resolve: Function) => {
            const ulPms = urlParams ? { ...this.headers, ...urlParams } : { ...this.headers };

            let url = serializeUrl(this.host, '', ulPms) as string;

            if (!/^[a-zA-Z]{2,10}:\/\//.test(url)) {
                url = `http://${url}`;
            }

            const logger = this.logger;

            const internalError = {
                statusCode: 500,
                success: false,
                data: { error: 'Internal error' },
            };

            logger.warnI(`Connecting with headers / url params "${JSON.stringify(ulPms)}"`);

            const successEvent = onSuccessEvent ? onSuccessEvent : `${onSuccessEvent}-success`;
            const errorEvent = onErrorEvent ? onErrorEvent : `${onErrorEvent}-error`;

            logger.warnI(`Connecting to: ${url}`);

            const WS = require('websocket').w3cwebsocket;
            const ws = new WS(url);

            const self = this;

            if (!asynchronous) {
                ws.onopen = () => {
                    logger.warnI(`Connected to: ${url}`);
                    logger.warnI('emitEvent: ' + emitEvent);

                    emit(ws, emitEvent, payload);

                    const timer = setTimeout(() => {
                        try {
                            ws.close();
                        }
                        catch (err) {
                            logger.errorI(`Websocket connection timeout error: ${err.message}`, 'WsIntegration: onerror 1');
                        }
                        self.adm.previousStepSuccessful = false;

                        return resolve(internalError);

                    }, 4000);

                    ws.onmessage = (e: any) => {
                        try {
                            const res = JSON.parse(e.data);

                            if (timer) clearTimeout(timer);

                            logger.warnI(`Reponses "${e.data}"`);

                            ws.close();

                            switch (res?.event ?? '') {
                                case successEvent:
                                    self.adm.previousStepSuccessful = true;

                                    return resolve(res.data);

                                case errorEvent:
                                    // [ERROR]:  7. ERROR FROM DEFAULT "BaseAction" MAIN ACTION: "There was an unknown error" : BaseAction->run: execRun (execCb) action chain: catch
                                    self.adm.previousStepSuccessful = false;
                                    return resolve(res.data);

                                default:
                                    self.adm.previousStepSuccessful = false;
                                    return resolve(internalError);
                            }
                        }
                        catch (e) {
                            self.adm.previousStepSuccessful = false;
                            ws.close();

                            logger.errorI(`WsIntegration try/catch error: ${e.message}`, 'WsIntegration: onerror 2');

                            return resolve(internalError);
                        }
                    };
                };
            }
            else {
                ws.onopen = () => {
                    logger.warnI(`Connected to: ${url}`);
                    logger.warnI('emitEvent: ' + emitEvent);

                    emit(ws, emitEvent, payload);
                    ws.close();

                    self.adm.previousStepSuccessful = true;
                    self.adm.setSuccess('WsIntegration was successful');

                    return resolve({
                        statusCode: 200,
                        success: true,
                        data: { message: 'WsIntegration was successful' },
                    });
                }
            }

            ws.onerror = function (error: any) {
                logger.errorI(`Connection error: ${url}`, 'WsIntegration: onerror 3');
                self.adm.previousStepSuccessful = false;
console.log('Connection error: ', error);
                return resolve(internalError);
            };
        });
    }
}