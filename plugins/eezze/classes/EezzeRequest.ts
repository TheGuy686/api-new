import { Request, Response } from 'express';
import { RequestErrorMessagesI } from '../interfaces';
import Logger from './Logger';
import Authenticator, { AuthUserI } from './Authenticator';
import { generateRandomString } from '../libs/StringMethods';

export default class EezzeRequest {
    public __id: string;
    private _request: any;
    private _logger: Logger;
    private _method: RESTFUL_METHODS;
    private _host: string;
    private _protoCal: string;
    private _fullUrl: string;
    private _urlPath: string;
    private _urlParams: any;
    private _requestBody: any;
    private _response: Response;
    private _requestIp: string;
    private _requestSrcId: string = 'NA';
    private _requestStart: number;
    private _accessedFromBrowser: boolean = false;
    private _headers: any = {};
    private _auth: Authenticator = new Authenticator();
    public validationErrors: RequestErrorMessagesI = {};
    private _executionErrors: any = {};
    private _type: string = 'rest';
    private _server: any;

    public get id() { return this.__id }
    public get protocol() { return this._protoCal }
    public get server() { return this._server }
    public get type() { return this._type }

    constructor(req: Request | any, res: Response | any, logger: Logger) {
        this.__id = generateRandomString(7);

        this._request = req;
        this._logger = logger;
        this._method = req.method as RESTFUL_METHODS;
        this._protoCal = req.protocol;
        this._host = req.get('host');
        this._fullUrl = req.protocol + '://' + this._host + req.originalUrl;
        this._urlPath = req.originalUrl;
        this._urlParams = req.query;
        this._requestBody = req.body;
        this._response = res;
        this._headers = req.headers;
        this._requestIp = (this._headers['x-forwarded-for'] || req.connection.remoteAddress) as string;
        this._requestStart = Date.now();

        if (req.xhr || req.headers.accept && ( req.headers.accept.indexOf('json') > -1 )) {
            this._accessedFromBrowser = false;
        }
        else {
            this._accessedFromBrowser = true;
        }
    }

    public addExecutionError (key: string, message: string) {
        this._executionErrors[key] = message;
    }
    public get executionErrors() : any {return this._executionErrors}
    public hasExecExemption (key: string) {
        return typeof this._executionErrors[key] === 'string';
    }

    public get requestSrcId() : string {return this._requestSrcId}
    public get request() : Response {return this._request}
    public get response() : Response {return this._response}
    public get method() : string {return this._method}
    public get auth() : AuthUserI {return this._auth}
    public get host() : string {return this._protoCal + '://' + this._host}
    public get fullUrl() : string {return this._fullUrl}
    public get urlPath() : string {return this._urlPath}
    public get urlParams() {return this._urlParams}
    public get requestHeaders() {return this._headers}
    public get requestBody() {return this._requestBody}
    public get requestIp() {return this._requestIp}
    public get requestStart() {return this._requestStart}
    public get accessedFromBrowser() {return this._accessedFromBrowser}

    public set requestSrcId(id: string) {this._requestSrcId = id}

    toObject() {
        return {
            fullUrl: this.fullUrl,
            urlParams: this.urlParams,
            requestBody: this.urlParams,
            requestIp: this.requestIp,
        }
    }
}