import { RequestErrorMessagesI } from '../interfaces';
import Logger from './Logger';
import Authenticator, { AuthUserI } from './Authenticator';
import { generateRandomString } from '../libs/StringMethods';
import { EWebSocket } from './EWebSocket';

export default class EezzeWsRequest {
    public __id: string;
    private _logger: Logger;
    private _socket: any;
    private _method: string;
    private _host: string;
    private _protoCal: string;
    private _fullUrl: string;
    private _urlPath: string;
    private _urlParams: any;
    private _requestBody: any;
    private _requestIp: string;
    private _requestSrcId: string = 'NA';
    private _requestStart: number;
    private _headers: any = {};
    private _auth: Authenticator;
    public validationErrors: RequestErrorMessagesI = {};
    private _executionErrors: any = {};
    private _type: string = 'ws';
    private _server: EWebSocket;

    constructor(socket: any, logger: Logger, server: EWebSocket) {
        this._auth = new Authenticator();
        this.__id = generateRandomString(7);
        this._logger = logger;
        const httpReq = socket.httpRequest;
        this._socket = socket;
        this._method = 'WS:' + (httpReq?.method ?? 'GET');
        this._protoCal = httpReq?.protocol ?? 'ws';
        this._requestIp = socket?.httpRequest?.remoteAddress ?? '127.0.0.1';
        this._host = httpReq?.host ?? '';
        this._urlPath = socket?.resourceURL?.pathname ?? '/';
        this._fullUrl = this._protoCal + '://' + (this._host ?? this._requestIp) + this._urlPath;
        this._headers = {}; // in case of websocket clients; httpReq?.headers , browser clients do not support headers for websockets
        this._urlParams = {...socket?.resourceURL?.query ?? {}};
        this._requestStart = Date.now();
        this._server = server;
    }

    public get id() { return this.__id }
    public get type() { return this._type }
    public get server() { return this._server }
    public get protocol() { return this._protoCal }
    public get requestSrcId() : string {return this._requestSrcId}
    public get method() : string {return this._method}
    public get auth() : AuthUserI {return this._auth}
    public get host() : string {return this._protoCal + '://' + this._host}
    public get fullUrl() : string {return this._fullUrl}
    public get urlPath() : string {return this._urlPath}
    public get urlParams() {return this._urlParams}
    public get requestHeaders() {return this._headers}
    public get requestBody() {return this._requestBody}
    public get requestIp() {return this._requestIp}
    public get socket() {return this._socket}
    public get requestStart() {return this._requestStart}
    public get origin() {
        if (!this._host) return this.requestIp;

        return this._host;
    }
    public get executionErrors() : any {return this._executionErrors}

    public set requestSrcId(id: string) {this._requestSrcId = id}
    public set requestBody(body: any) {this._requestBody = body}

    public addExecutionError (key: string, message: string) {
        this._executionErrors[key] = message;
    }

    public hasExecExemption (key: string) {
        return typeof this._executionErrors[key] === 'string';
    }

    public toObject() {
        return {
            fullUrl: this.fullUrl,
            urlParams: this.urlParams,
            requestBody: this.requestBody,
            requestIp: this.requestIp,
        }
    }
}