import EezzeRequest from '../classes/EezzeRequest';
import ESocket from '../classes/ESocket';
import StackTraceJs from 'stacktrace-js';
import ADM from './ActionDataManager';
import LogicChain from './logic/LogicChain';
import { generateRandomString } from '../libs/StringMethods';
import WsIntegration from '../base/datasources/WsIntegration';

const color = require('colorts').default;

let socket: ESocket;

type ACTION_SRC = string | { _srcId: string; };

export default class Logger {
    private _srcType: string;
    private _loggingServer: string;
    private _logServ: any;
    private _loggerPayloadCb: E_CM_CB_OBJ | object;
    private _wsLoggerTypes: string[] = [ 'success', 'critical', 'error' ];

    public get logServer() { return this._loggingServer }
    public get hasLogger() {
        return typeof this._loggingServer == 'string' && this._loggingServer != '';
    }

    constructor(srcType: string, loggerPlCb?: E_CM_CB_OBJ, wsLoggerTypes?: string []) {
        if (loggerPlCb) {
            this._loggerPayloadCb = loggerPlCb;
        }

        this._srcType = srcType;

        if (wsLoggerTypes) {
            this._wsLoggerTypes = wsLoggerTypes;
        }
    }

    private _srcRequest: EezzeRequest;

    public set srcRequest(er: EezzeRequest) {this._srcRequest = er}

    public get srcRequest() {return this._srcRequest}

    async transformRequstToWsFormat(
        type: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'SUCCESS',
        message: any,
        source?: any,
        adm?: ADM,
        doDebug?: boolean,
    ) {
        let reqStart = 0,
            srcRequestId = 'rand-log_' + generateRandomString(10),
            srcType = 'na',
            srcIp = '0.0.0.0',
            callSrc = 'na',
            srcUrlPath = 'na',
            srcPathMethod = 'na',
            operationId: 'na',
            reqMetadata = {};

        try {
            reqStart = this._srcRequest?.requestStart;
            srcRequestId = this.srcRequest?.requestSrcId;
            srcType = this?._srcType;
            srcIp = this.srcRequest?.requestIp;
            callSrc = source?._srcId;
            operationId = source?.operationId;
            srcUrlPath = this._srcRequest?.urlPath,
            srcPathMethod = this._srcRequest?.method;
            reqMetadata = this.srcRequest?.toObject();
        }
        catch (e) {
            console.log('Logger->transformRequstToWsFormat: Unsuccessful: ', e.message, message);
        }

        const now = Date.now();
        const diff = now - reqStart;

        let loggerPl = {};

        if (typeof this._loggerPayloadCb == 'function') {
            loggerPl = await this._loggerPayloadCb(adm, new LogicChain(adm, this), source);
        }
        else if (typeof this._loggerPayloadCb == 'object') {
            loggerPl = loggerPl;
        }

        if (Object.keys(loggerPl ?? {}).length == 0) return false;

        if (doDebug) {
            console.log(`transformRequstToWsFormat: "${type}"->"${typeof message == 'object' ? JSON.stringify(message) : message}"`, {
                ...loggerPl,
                data: {
                    id: generateRandomString(10),
                    sourceRequestId: srcRequestId,
                    time: {
                        from: reqStart,
                        to: now,
                        duration: diff
                    },
                    level: type,
                    operationId,
                    type: srcType,
                    callSrc,
                    sourceIp: srcIp,
                    message,
                    requestMetadata: JSON.stringify(reqMetadata, null, 4),
                    createdAt: Date.now(),
                    urlPath: srcUrlPath,
                    method: srcPathMethod,
                }
            });
        }

        return {
            ...loggerPl,
            data: {
                id: generateRandomString(10),
                sourceRequestId: srcRequestId,
                time: {
                    from: reqStart,
                    to: now,
                    duration: diff
                },
                level: type,
                operationId,
                type: srcType,
                callSrc,
                sourceIp: srcIp,
                message,
                requestMetadata: JSON.stringify(reqMetadata, null, 4),
                createdAt: Date.now(),
                urlPath: srcUrlPath,
                method: srcPathMethod,
            }
        };
    }

    private async emitToClientLogger(adm: ADM, payload: any, doDebug: boolean = false) {
        let loggerPl;

        if (!payload) return;

        if (typeof this._loggerPayloadCb == 'function') {
            loggerPl = await this._loggerPayloadCb(adm, new LogicChain(adm, this));
        }
        else if (typeof this._loggerPayloadCb == 'object') {
            loggerPl = this._loggerPayloadCb;
        }

        let res;

        try {
            if (doDebug) {
                console.log(
                    'emitToClientLogger params: ',
                    { host: `${loggerPl?.host}:${loggerPl?.port}${loggerPl?.path}` },
                    { eventName: 'Log' },
                    {},
                    {
                        projectId: loggerPl?.projectId,
                        ...payload,
                    }
                );
            }

            res = await WsIntegration.doAction(
                { host: `${loggerPl?.host}:${loggerPl?.port}${loggerPl?.path}` },
                { eventName: 'Log' },
                {},
                {
                    projectId: loggerPl?.projectId,
                    ...payload
                },
                {},
                { logger: this },
                adm,
            );
        }
        catch (err) {
            console.log('Error doing socket action from logger: ', err);
        }
    }

    private _checkLogParams(log: string, message: string, source: ACTION_SRC, adm: ADM) {
        if (typeof source != 'undefined' && source instanceof ADM) {
            console.log('SRC TYPE: ', typeof source);
            console.trace(`${log}->source`);
            console.log(StackTraceJs.get());
            console.error(`Source can not be an instance of ADM "${log}"->${message}"`);
            process.exit();
        }

        if (typeof adm != 'undefined' && !(adm instanceof ADM)) {
            console.log('ADM TYPE: ', typeof adm);
            console.trace(`${log}->adm`);
            console.log(StackTraceJs.get());
            console.error(`Adm can not be an instance of ADM "${log}"->"${message}"`);
            process.exit();
        }
    }

    connectToLoggingServer(arg1: any, a2: any, a3: any, a4?: any) {}

    debugI (str: string, source?: ACTION_SRC, adm?: ADM) {
        console.info(color(`\n[DEBUG]:`).cyan.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).cyan.str);
    }

    infoI (str: string, source?: ACTION_SRC, adm?: ADM) {
        //console.info(color(`\n[INFO]:`).cyan.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).cyan.str);
    }

    warnI (str: any, source?: ACTION_SRC, adm?: ADM) {
        // console.info(color(`\n[WARN]:`).magenta.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).magenta.str);
    }

    errorI (str: string, source: ACTION_SRC, adm?: ADM) {
        console.info(color(`\n[ERROR]:`).red.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).red.str);
    }

    successI (str: string, source?: ACTION_SRC, adm?: ADM) {
        console.info(color(`\n[SUCCESS]:`).green.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).green.str);
    }

    debug (str: string, source?: ACTION_SRC, adm?: ADM, wsLoggerTypes?: string[], doDebug?: boolean) {
        this._checkLogParams('debug', str, source, adm);

        if (this._loggerPayloadCb) {
            const wlt = wsLoggerTypes ?? this._wsLoggerTypes;

            if (wlt.includes('debug')) {
                setTimeout(async () => await this.emitToClientLogger(
                    adm,
                    await this.transformRequstToWsFormat('DEBUG', str, source, adm, doDebug),
                    doDebug,
                ), 1);
            }
        }
        
        console.info(color(`\n[DEBUG]:`).cyan.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).cyan.str);
    }

    info (str: string, source?: ACTION_SRC, adm?: ADM, wsLoggerTypes?: string[], doDebug?: boolean) {
        this._checkLogParams('info', str, source, adm);

        if (this._loggerPayloadCb) {
            const wlt = wsLoggerTypes ?? this._wsLoggerTypes;

            if (wlt.includes('info')) {
                setTimeout(async () => {
                    await this.emitToClientLogger(
                        adm,
                        await this.transformRequstToWsFormat('INFO', str, source, adm, doDebug),
                        doDebug,
                    );
                }, 1);
            }
        }

        console.info(color(`\n[INFO]:`).cyan.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).cyan.str);
    }

    warn (str: any, source?: ACTION_SRC, adm?: ADM, wsLoggerTypes?: string[], doDebug?: boolean) {
        this._checkLogParams('warn', str, source, adm);

        if (this._loggerPayloadCb) {
            const wlt = wsLoggerTypes ?? this._wsLoggerTypes;

            if (wlt.includes('warn')) {
                setTimeout(async () => await this.emitToClientLogger(
                    adm,
                    await this.transformRequstToWsFormat('WARN', str, source, adm, doDebug),
                    doDebug,
                ), 1);
            }
        }

        //console.info(color(`\n[WARN]:`).magenta.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).magenta.str);
    }

    error (str: string, source: ACTION_SRC, adm?: ADM, wsLoggerTypes?: string[], doDebug?: boolean) {
        this._checkLogParams('error', str, source, adm);

        if (this._loggerPayloadCb) {
            const wlt = wsLoggerTypes ?? this._wsLoggerTypes;

            if (wlt.includes('error')) {
                if (typeof adm == 'undefined') {
                    console.trace('adm undefined');
                }

                setTimeout(async () => await this.emitToClientLogger(
                    adm,
                    await this.transformRequstToWsFormat('ERROR', str, source, adm, doDebug),
                    doDebug,
                ), 1);
            }
        }
        
        console.info(color(`\n[ERROR]:`).red.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).red.str);
    }

    critical (str: string, source?: ACTION_SRC, killProcess: boolean = true, adm?: ADM, wsLoggerTypes?: string[], doDebug?: boolean) {
        this._checkLogParams('critical', str, source, adm);

        if (this._loggerPayloadCb) {
            const wlt = wsLoggerTypes ?? this._wsLoggerTypes;

            if (wlt.includes('critical')) {
                setTimeout(async () => await this.emitToClientLogger(
                    adm,
                    await this.transformRequstToWsFormat('CRITICAL', str, source, adm, doDebug),
                    doDebug,
                ), 1);
            }
        }

        console.log(StackTraceJs.get());
        console.info(color(`\n[CRITICAL]:`).red.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).red.str);
        
        if (killProcess) process.exit();
    }

    success (str: string, source?: ACTION_SRC, adm?: ADM, wsLoggerTypes?: string[], doDebug?: boolean) {
        this._checkLogParams('success', str, source, adm);

        if (this._loggerPayloadCb) {
            const wlt = wsLoggerTypes ?? this._wsLoggerTypes;

            if (wlt.includes('success')) {
                setTimeout(async () => await this.emitToClientLogger(
                    adm,
                    await this.transformRequstToWsFormat('SUCCESS', str, source, adm, doDebug),
                    doDebug,
                ), 1);
            }
        }

        console.info(color(`\n[SUCCESS]:`).green.str + color(`  ${typeof str == 'object' ? JSON.stringify(str, null, 4) : String(str)}`).green.str);
    }
}