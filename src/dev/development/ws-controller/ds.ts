import { Logger } from "@eezze/classes";
import { isPromise } from "@eezze/libs/ObjectMethods";
import Connection from "./Connection";
import { setEvents, setServer } from "./decorators";

const WsServer = require('websocket').server;
const http = require('http');
const server = http.createServer();

type CONNECTION_COUNTERS = {[key: string]: number};

const TOTAL_DEFAULTS = {
	total: 0,
	paths: {},
}

interface CONNECTION_TOTAL_COUNTERS {
	total: number;
	paths: CONNECTION_COUNTERS;
}

interface WsConnectionArgsI {
	logger: Logger;
    host: string;
    port: number;
    autoReconnect?: boolean;
}

const getUniqueID = () => {
	const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	return s4() + s4() + '-' + s4();
};

// This is an example of how to create a websocket server
// https://github.com/AvanthikaMeenakshi/node-websockets/blob/master/server/index.js
export class EWebSocket {
	private logger: Logger;
    private _isConnected: boolean = false;
    private socket: typeof WsServer;
    private _events: any = {};
	private autoReconnect: boolean = true;
	private autoReconnectDelay: number = 5000;
	private tmr: any;
	private _connectionCouters: CONNECTION_TOTAL_COUNTERS = {total: 0, paths: {}};
    private _connections: {
		[path: string]: {
			[key: string]: Connection
		}
	} = {};

    public get isConnected() {return this._isConnected}
    public get connections() {return this._connections}
    public get events() {return this._events}

	public checkPath(path: string) {
		return typeof this.events[path] == 'object';
	}

	public incrementTotal(path?: string) {
		this._connectionCouters.total++;
		if (this._connectionCouters.paths[path]) {
			this._connectionCouters.paths[path]++;
		}
	}

	public deincrementTotal(path?: string) {
		this._connectionCouters.total--;
		if (this._connectionCouters.paths[path]) {
			this._connectionCouters.paths[path]--;
		}
	}

	public on (eventName: string, callback: Function, path: string ='/') {
		if (typeof callback != 'function') {
			throw new Error(`Callback for "${path}:${eventName}" was not a fuction. Got: ${typeof callback}`);
		}

		if (typeof this.events[path] == 'undefined') {
			this.events[path] = {};
		}
		if (typeof this.events[path][eventName] == 'undefined') {
			this.events[path][eventName]= [];
		}

		this.events[path][eventName].push(callback);
	}

	public connect (args: WsConnectionArgsI) {
        if (this.isConnected) return;

		this.logger = args.logger;

		try {
			server.listen(args.port);

			this.socket = new WsServer({httpServer: server});

			setEvents(this.events);

			this.initServerEvents();
		}
		catch (e) {
			console.log('ESocket:connect: ', e)
		}
    }

	public async emit (eventName: string, clientSocket: any, payload: any, path: string = '/') {
		if (typeof this.events[path][eventName] == 'undefined') {
			// return console.log(
			// 	`Critical: There was no event with the name "${eventName}" in the "${path}"`
			// );
			return;
		}

		for (const evt of this.events[path][eventName]) {
			isPromise(evt) ? await evt(clientSocket, payload) : evt(clientSocket, payload);
		}
	}

	private initServerEvents() {
		// this is where we init the "on new incoming connection" events & connection
		this.socket.on('request', (request: any) => {
			const connId = getUniqueID();

			const conn = new Connection({
				logger: this.logger,
				request,
				connId
			}, this as any);

			// if the connection is not accepted for any reason then we need to reject the connection
			if (!conn.isValidConnection) return request.reject();

			if (typeof this._connections[conn.connPath] == 'undefined') {
				this._connections[conn.connPath] = {};
			}

			this._connections[conn.connPath][connId] = conn;
		});
	}
}

export default class SocketServerDatasource {
    private socket: EWebSocket;
    private host: string = process.env.DATABASE_HOST;
    private port: number = 2000;

	async includeAllControllers() {
		const cnt1 = await import('./SocketController');

		new cnt1.default();

		const cnt2 = await import('./SocketController2');

		new cnt2.default();
	}

	async run() {
		const socket = new EWebSocket();
		setServer(socket);

		await this.includeAllControllers();

        socket.connect({
			logger: new Logger('laksjdflajkds'),
            host: this.host,
            port: this.port,
        });
	}
}