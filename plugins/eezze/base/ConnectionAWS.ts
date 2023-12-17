import { SerializedConnectionI } from '../interfaces/SerializedConnectionI';
import Logger from '../classes/Logger';
import { kebabCase } from '../libs/StringMethods';

interface ConArgsI {
    id: string | number;
	types: string[];
	host?: string;
	alias?: string;
	path?: string;
    port?: number | string;
    ip?: string;
    secure?: boolean;
    devIsSecure?: boolean;
    protocol?: string;
    secureProtocol?: string;
    localhost?: string;
    storeState?: boolean;
    storeStateInterval?: number;
	[key: string]: any;
}

const DEFAULT_LH = '0.0.0.0';

export default class ConnectionAWS {
    private _logger: Logger;
    private _envIsDev: boolean = false;
    private _dbId: string | number;
    public _srcId: string = '_con';
    /**
        "serviceTypes": [
            "rest",
            "websocket",
            "cron-task",
            "installable-services"
        ]
    */
    public types: string[] = [];
    public type: string = 'aliased-network';
    private _host: string;
    public _path: string = '';
    public alias: string;
    private _networkAlias: string;
    public _port: number;
    public user: string;
    public password: string;
    public storeState: boolean = false;
    public storeStateInterval: number;
    public ip: string;
    public devIsSecure: boolean = false;
    public secure: boolean = false;
    public _protocol: string = 'http';
    public _secureProtocol: string = 'https';
    public _localhost: string = 'localhost';
    private _isExternal: boolean = false;

    public get isDev() { return this._envIsDev }
    public get port() {return this._port}
    public get dbId() { return this._dbId }
    public get isDefaultHost() {
        if (this.alias) return this.alias === DEFAULT_LH;
        if (this.ip) return this.ip === DEFAULT_LH;
        return this._host == DEFAULT_LH;
    }
    public get networkAlias() {return this._networkAlias}

    public get secureProtocol() { return this._secureProtocol }

    public get protocol() {
        if (this._envIsDev) return this.devIsSecure ? this._secureProtocol : this._protocol;
        return this.secure ? (this.devIsSecure ? this._secureProtocol : this._protocol) : this._protocol;
    }

    /**
     * General Rules:
     *
     *  1. If the call is an internal call then we need to fall back to the internal ips.
     *     In general this is because the websockets listens on localhost / 0.0.0.0. Becase of this
     *     we can't use the IP addresss. So when we call the "cennection" funciton which sets the isInternal
     *     to "true" then this by default will always get the internal addresses over the external. This will
     *     allow us to access the websocket back and forth with the different addresses.
     *     If this is an installable-services (server) then we should have already defaulted to
     *     the 0.0.0.0.
     *
     *  2. If there is an "alias" set in the Connection.ts file then this should override everything
     *  3. Then we should always fall back to the localhost
     *
     */
    // @HostSet #2
    public get host (): string {
        //  // this assuming port forwarding
        //  if (this.alias) return this.alias;

         const port = this._port ? `:${this._port}` : '';

        //  // when we set an IP explicitly
        //  if (this.ip) return `${this.ip}${port}`;

         // default to host setting
         return `${this.hostName}${port}`;
    }

    public get hostName() : string {
        if (this.alias) return this.alias;
        if (this.ip) return this.ip;
        return this._host;
    }

    public get path () : string {
        if (this._path) return this._path;

        return '';
    }

    public get fullUrl() {
        return `${this.protocol}://${this.host}${this.path}`;
    }

    public get externalHostName() {
        let url = this.ip;

        if (this.alias) url = this.alias;
        else if (this._host) url = `${this._host}`;

        return url;
    }

    public get externalUrl() {
        let url = this.ip;

        const port = this.port ? `:${this.port}` : '';

        if (this.alias) url = this.alias;
        else if (this._host) url = `${this._host}`;

        return `${this.protocol}://${url}${this.path}${port}`;
    }

    constructor(args: ConArgsI, name: string, logger: Logger) {

        this._logger = logger;

        this._envIsDev = process.env.environment != 'prod';

        this._dbId              = args.id;
        this.types              = args.types;
        this.alias              = args.alias;
        this._networkAlias      = kebabCase(name);
        this._path              = args?._path;
        this.user               = args?.user;
        this.password           = args?.password;
        this.ip                 = args.ip;
        this._localhost         = args?.localhost;
        this._host              = args.host;
        this._protocol          = args?.protocol;
        this._secureProtocol    = args?.secureProtocol;
        this.storeState         = !!args?.storeState;
        this.storeStateInterval = Number(args?.storeStateInterval) ?? 5000;
        this.devIsSecure        = args?.devIsSecure;
        this.secure = args.secure;

        if (typeof args?.port == 'number') {
            this._port = Number(args.port);
        }
    }

    public serialize(): SerializedConnectionI {
        return {
            secure: this.secure,
            devIsSecure: this.devIsSecure,
            protocol: this.protocol,
            hostName: this.hostName,
            host: this._host,
            alias: this.alias,
            ip: this.ip,
            local: this._localhost,
            port: this._port ?? undefined,
            externalHostName: this.externalHostName,
            fullUrl: this.fullUrl,
        }
    }

    public setToExternal() {
        this._isExternal = true;
        Object.freeze(this._isExternal);
    }
}