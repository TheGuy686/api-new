import { getUniqueId, space, kebabCase, pascalCase } from '../libs/StringMethods';
import express from 'express';
import { createService } from '../libs/Threads';
import EezzeService from '../services/eezze-services';
import Logger from '../classes/Logger';
import WebSocketConnection from './WebSocketConnection';
import WsState from './WsState';
import ActionDataManager from './ActionDataManager';
import EezzeWsRequest from './EezzeWsRequest';

const cors = require('cors');

const healthApp = express();
const morgan = require('morgan');

healthApp.use(cors());
healthApp.use(express.json({ limit: '1000mb' }));
healthApp.use(morgan('combined'));

healthApp.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
});

const WsServer = require('websocket').server;

process.stdin.resume();

function exitHandler(options: any, exitCode: any) {
    if (options.cleanup) {
		// console.log('clean');
	}
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

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
	secure?: boolean;
    autoReconnect?: boolean;
	initStateEvents?: boolean;
}

let statsService: any, storeTmr: any = null;

// This is an example of how to create a websocket server
// https://github.com/AvanthikaMeenakshi/node-websockets/blob/master/server/index.js
export class EWebSocket {
	private host: string;
	private _connection: E_CONNECTION;
	private _serverState: WsState = new WsState(true);
	private _state: E_REQUEST_STATE;
	private logger: Logger;
    private _isConnected: boolean = false;
    private socket: typeof WsServer;
    private _events: any = {};
	private _authenticator: any;
	private autoReconnect: boolean = true;
	private autoReconnectDelay: number = 5000;
	private tmr: any;
	private _connectionCouters: CONNECTION_TOTAL_COUNTERS = {total: 0, paths: {}};
	private _allConnections: any = {};
    private _connections: {
		[ path: string ]: {
			[ key: string ]: WebSocketConnection
		}
	} = {};
	private connectionStr: string;
	private _channels: any = {};
	private _connectionIdCb: E_CM_CB_STR;

	private serverStoreConfig: any = {};

	public get serverState() { return this._serverState.state }
	public get state()       { return this._state.state }
    public get isConnected() { return this._isConnected }
    public get connections() { return this._connections }
    public get events()      { return this._events }

	private _emitToAllChangedTmr: any = null;

	private _trustedOrigins: string[];

	constructor(
		connection: E_CONNECTION,
		authenticator?: any,
		connectionId?: E_CM_CB_STR,
		serverStoreConfig?: any,
		trustedOrigins?: string[],
	) {
		this._connection = connection;
		this._state = new WsState();

		this._state.setStateChangeCb(this._stateChanged.bind(this));
		this._serverState.setStateChangeCb(this._serverStateChanged.bind(this));

		if (authenticator)  this._authenticator  = authenticator;
		if (trustedOrigins) this._trustedOrigins = trustedOrigins;

		if (connectionId) this._connectionIdCb = connectionId;

		if (typeof serverStoreConfig == 'object') {
			if (serverStoreConfig.storeState) {
				if (!statsService) {
					statsService = createService(`${__dirname}/../services/read-system-info con-id=${connection?.dbId}`);
				}
			}

			this.serverStoreConfig = serverStoreConfig;
		}
	}

	public startHealthServer() {
		const port = this.serverStoreConfig?.healthCheckPort;

        healthApp.listen(port, this._connection._localhost, () => {
            console.log(`${space(2)}Health Server is running on port 0.0.0.0:${port}`);
        });
    }

	private originIsAllowed(origin: string) {
		// console.log('Checking: ', origin, ' : ', this._trustedOrigins);
		if (this._trustedOrigins) return this._trustedOrigins.includes(origin);
		return true;
	}

	public emitToAll(state: any) {
		const emittedIds: any[] = [];

		for (const channel in this._connections) {
			for (const conId in this._connections[channel]) {
				if (emittedIds.includes(conId)) continue;
				emittedIds.push(conId);
				const c = this._connections[channel][conId];
				c.emit('server-state-changed', state);
			}
		}
	}

	private _stateChanged(prop: string, value: any, state: any) {
		if (this._emitToAllChangedTmr) clearTimeout(this._emitToAllChangedTmr);

		this._emitToAllChangedTmr = setTimeout(() => this.emitToAll(state), 1000);
	}

	private _serverStateChanged(channel: string, value: any, state: any) {
		if (this._emitToAllChangedTmr) clearTimeout(this._emitToAllChangedTmr);

		this._emitToAllChangedTmr = setTimeout(() => {

			const ch = this._channels?.[channel];

			if (typeof ch == 'object' && ch?.emitState) {
				const conns = this.getChannel(channel);

				if (typeof conns == 'object') {
					this.broadcastState(
						'',
						ch.event + 'StateChanged',
						state?.[channel] ?? {},
						channel
					);
				}
			}

		}, 1000);
	}

	public getServerState(channel: string, ) {
		if (typeof this._serverState.state[channel] == 'undefined') {
			return {
				connections: 0,
				state: this.state,
				sessions: {},
				errors: [ `Channel "${channel}" did not exist` ],
			};
		}

		const state = this._serverState.state[channel];

		state.state = this._state.state;

		return state;
	}

	private listRoutes(port: any) {
		console.log(`\n`);
        console.log(`${space(2)}Server listening on: 0.0.0.0:${port}\n`);
        console.log(`${space(4)}Registered Paths and operations: \n`);

		for (const path in this.events) {
			console.log(`${space(6)}${this.connectionStr + path}\n`);

			for (const oid in this.events[path]) {
				console.log(space(8), oid, this.events[path][oid].length, 'subs');
			}
		}

		console.log(`\n`);
		// console.log(`${space(7)}Internal Paths and operations: \n`);

		// for (const path in this.internalEvents) {
		// 	for (const oid in this.internalEvents[path]) {
		// 		console.log(space(9), oid, this.internalEvents[path][oid].length, 'subs');
		// 	}
		// }

		// console.log('\n');
    }

	public hasChannel(channel: string) {
		channel = channel.replace(/\/$/, '');

		return typeof this._connections[channel] == 'object';
	}

	public getChannel(channel: string) {
		if (!this.hasChannel(channel)) return {};

		return this._connections[channel];
	}

	public getChannelState(channel: string) {
		if (!this.hasChannel(channel)) return {};

		return this._serverState.state[channel];
	}

	public registerChannel(channel: string) {
		if (this.hasChannel(channel)) return;
		this._connections[channel] = {};
	}

	public getConnection(id: string) {
		if (typeof this._allConnections[id] == 'undefined') return false;

		return this._allConnections[id];
	}

	public flushConnection(id: string) {
		try {
			delete this._allConnections[id];
		}
		catch (err) {
			console.log(`EWebSocket->flushConnection Error: `, err);
		}
	}

	public unsubscribe(channel: string, connId: string) {
		try {
			if (typeof this._connections[channel] == 'object') {
				if (typeof this._connections[channel][connId] != 'undefined') {
					// sync the counters
					this._serverState.state[channel].connections--;

					// delete the user from that channel sessions
					delete this._serverState.state[channel].sessions[connId];

					// delete the connection from the channels
					delete this._connections[channel][connId];
				}
			}
		}
		catch (err) {
			console.log(err);
			this.logger.errorI(`There was an error unsubscribing to channel "${channel}"`, 'EWebSocket: unsubscribe: catch');
		}
	}

	public initChannelState(channel: string) {
		// set the inital connections object incase there isn't any connections subscribed yet
		if (typeof this._connections[channel] == 'undefined') {
			this._connections[channel] = {};
		}

		// set the initial state of the channel if there isn't any subsctiptions yet
		if (typeof this._serverState.state[channel] == 'undefined') {
			this._serverState.state[channel] = {
				connections: 0,
				sessions: {},
			};
		}
	}

	public deleteChannel(channel: string) {
		if (typeof this._serverState.state[channel] == 'undefined') return;
		const sessions = this._serverState.state[channel].sessions;

		if (Object.keys(sessions).length > 0) return;

		delete this._serverState.state[channel];
	}

	public addChannelSubState(channel: string, connection: WebSocketConnection, session: any) {
		// set the user session and get ready to broadcast the state changes to the channel
		this._serverState.state[channel].sessions[connection.id] = session;

		// this is here as the sessions get added first before the connection to the object
		// therefore we have to rely on the amount of sessions instead of the connection number
		const sessions = this._serverState.state[channel].sessions;

		// handle the connections state of the channel
		this._serverState.state[channel].connections = Object.keys(sessions).length;
	}

	public removeChannelSubState(channel: string, connection: WebSocketConnection) {
		try {
			// set the user session and get ready to broadcast the state changes to the channel
			delete this._serverState.state[channel].sessions[connection.id];

			// this is here as the sessions get added first before the connection to the object
			// therefore we have to rely on the amount of sessions instead of the connection number
			const sessions = this._serverState.state[channel].sessions;

			const seshTot = Object.keys(sessions).length;

			// if there is no current sessions then we can just delete the room
			if (seshTot == 0) {
				// here we give the delete channel a small timeout just incase there is someone
				// connecting or some other action just as we are deleting
				setTimeout(() => this.deleteChannel(channel), 1000);
			}
			else {
				// handle the connections state of the channel
				this._serverState.state[channel].connections = seshTot;
			}
		}
		catch (err) {
			this.logger.errorI(`WebsocketConnection->removeChannelSubState: Error: ${err.message}`, 'EWebSocket: removeChannelSubState: catch');
		}
	}

	public async subscribeToChannel(
		channel: string,
		connection: WebSocketConnection,
		adm: ActionDataManager,
		event: string,
	) {
		this.initChannelState(channel);

		this._connections[channel][connection.id] = this._allConnections[connection.id];

		const eKey = pascalCase(event);

		const stateChangeEvt = `On${eKey}StateChanged`;
		const onConChangeEvt = `On${eKey}Connection`;

		let cb, emitState = false;

		const evts = connection.internalEvents?.[channel] ?? {};

		// this is where we get the user if there is a state emitter
		if (typeof evts[stateChangeEvt] == 'function') {
			cb = evts[stateChangeEvt];
			emitState = true;
		}
		// here is where we get the user from the onConnection cb if set
		// there can be other things in the onConnection cb, but this will be the user / session information
		else if (typeof evts[onConChangeEvt] == 'function') {
			cb = evts[onConChangeEvt];
		}

		if (typeof this._channels[channel] == 'undefined') {
			if (emitState) {
				this._channels[channel] = {
					event: eKey,
					channel,
					emitState,
					stateChangeCb: cb
				};
			}
			else {
				this._channels[channel] = {
					event: eKey,
					channel,
					emitState,
					stateChangeCb: () => { console.log('The state change cb should be used if the "emitState" is not set to true'); }
				};
			}
		}

		let session;

		// user to the user() cb or onConnection payload
		if (typeof cb == 'function') {
			session = await cb(adm);
		}
		// default to the user in the auth object
		else session = adm.request?.auth?.user ?? {};

		// don't know why this is here. We might need to look into this one later
		// if (typeof this._connections[channel][connection.id] == 'object') return;

		// handle the connections state of the channel
		this.addChannelSubState(channel, connection, session)

		return true;
	}

	public broadcastState(connId: string, event: string, data: any = {}, channel = '/v1') {
		data.channelId = channel;

		this.broadcast(connId, event, data, channel, true);
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

	public broadcast(connId: string, event: string, data: any = {}, path = '/v1', includeOwnConnection: boolean = false) {
		const conns = this._connections[path];

		if (typeof conns == 'undefined' || Object.keys(conns).length == 0) {
			this.logger.infoI(`There was no connections in the "${path}" to broadcast to`);
			return;
		}

		for (const id in conns) {
			if (!includeOwnConnection && id == connId) continue;

			const evt = kebabCase(event).replace(/^on-/, '');

			this.logger.infoI(`Broadcasat->Emitted event "${evt}"`);

			try {
				conns[id].emit(evt, data);
			}
			catch (err) {
				console.log('Error: ', err);
				this.logger.errorI(`EWebSocket->broadcast Error: Could not emit event "${evt}"`, 'EWebSocket->broadcast Error');
			}
		}
	}

	private async _doConnect(args: WsConnectionArgsI) {
		this.connectionStr = `${args.host}:${args.port}`;

		if (!/ws|wws|http|https/.test(this.connectionStr)) {
			this.logger.infoI(`EWebSocket: There was no protocol detected on url "${this.connectionStr}". Defaulted to: ws://`);
			this.connectionStr = `ws://${this.connectionStr}`;
		}

		this.logger.warnI(`EWebSocket:connect: ${this.connectionStr}`);

		let hts;

		if (args?.secure) {
			this.logger.infoI('WebSocket is Secure');
			hts = require('https');
		}
		else {
			this.logger.infoI('WebSocket is Not secure');
			hts = require('http');
		}

		const server = hts.createServer();

		this.host = args.host;

		try {
			server.listen(args.port, '0.0.0.0');

			this.socket = new WsServer({ httpServer: server });

			await this.initServerEvents();

			if (args?.initStateEvents) {
				this.setStateEvents();
			}

			this.listRoutes(args.port);

			// this.startHealthServer();
		}
		catch (e) { console.log('ESocket:connect: ', e) }

		process.on('exit', () => {
			this.socket = null;
			exitHandler.bind(null, { cleanup: true, exit: true })()
		});

		// catches ctrl+c event
		process.on('SIGINT', () => {
			this.socket = null;
			exitHandler.bind(null, { cleanup: true, exit: true })();
		});

		// catches "kill pid" (for example: nodemon restart)
		process.on('SIGUSR1', () => {
			this.socket = null;
			exitHandler.bind(null, { cleanup: true, exit: true })();
		});
		process.on('SIGUSR2', () => {
			this.socket = null;
			exitHandler.bind(null, { cleanup: true, exit: true })();
		});

		// catches uncaught exceptions
		process.on('uncaughtException', () => {
			this.socket = null;
			exitHandler.bind(null, { cleanup: true, exit: true })();
		});
	}

	public async connect(args: WsConnectionArgsI) {
        if (this.isConnected) return;

		this.logger = args.logger;

		this._doConnect(args);
		this.startHealthServer();
	}

	public on (eventName: string, callback: Function, path: string ='/') {
		path = path.replace(/\/$/, '');

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

	public hasEventsPath(path: string) {
		return typeof this.events[path] != 'undefined';
	}

	public pathHasEvents(path: string, event: string) {
		try {
			if (typeof this.events[path][event] == 'undefined') return false;

			return true;
		}
		catch (err) {return false }
	}

	public async emit (eventName: string, clientSocket: any, payload: any, path: string = '/') {
		path = path.replace(/\/$/, '');

		if (!this.hasEventsPath(path)) {
			// console.log('this.events: ', this.events);
			console.log(`Path did not exist "${path}", Available paths "${Object.keys(this.events).join(', ')}"`);
			return;
		}

		if (!this.pathHasEvents(path, eventName)) {
			const exeps = [
				'OnConnection',
				'OnDisconnect',
			];

			if (!exeps.includes(eventName)) {
				console.log(
					`Critical: There was no event with the name "${eventName}" in the "${path}"`
				);
			}

			return;
		}

		for (const evt of this.events[path][eventName]) {
			try {
				await evt(clientSocket, payload);
			}
			catch (err) { console.log('Emit event error: ', err) }
		}
	}

	private initServerEvents() {
		// this is where we init the "on new incoming connection" events & connection
		this.socket.on('request', async (req: any) => {
			try {
				const request = new EezzeWsRequest(req, this.logger, this);

				// if there is any defined trusted connections then we need to allow that here
				if (this._trustedOrigins) {
					if (!this.originIsAllowed(request.origin)) {
						this.logger.warnI(`Rejected connection "${request.requestIp}:${request.fullUrl}" from "origions" check`);
						req.reject();
						return;
					}
				}

				const adm = new ActionDataManager(request, this.logger);

				const conn = new WebSocketConnection(this, this.logger, this._authenticator);

				const res = await conn.setConnection(adm);

				if (!res) return;

				const connId = this._connectionIdCb ? await this._connectionIdCb(adm) : getUniqueId();

				conn.finalizeConnection(connId);

				// if the connection is not accepted for any reason then we need to reject the connection
				if (!conn.isValidConnection) {
					this.logger.warnI(`Rejected connection "${request.requestIp}:${request.fullUrl}" from "isValidConnection" check`);
					return req.reject();
				}

				this._allConnections[connId] = conn;

				if (typeof this._connections[conn.connPath] == 'undefined') {
					this._connections[conn.connPath] = {};
				}

				this._connections[conn.connPath][connId] = this._allConnections[connId];
			}
			catch (err) {
				console.log('EWebSocket->onconnection error: ', err);
			}
		});
	}

	public setStateEvents() {
		const sc = this.serverStoreConfig;

		if (typeof sc == 'object') {
			if (sc.storeState) {
				const delay = sc?.storeStateInterval ? sc?.storeStateInterval : 5000;

				const path = `${__dirname}/../services/read-system-info.js con-id=${this._connection?.dbId}`;

				if (!statsService) {
					statsService = createService(path);
				}

				// const { decompress } = require('shrink-string');

				storeTmr = setInterval(() => {
					statsService.run(async (result: any, err: any, e2: any) => {
						// console.log('result: ', JSON.parse(await decompress()));

						// const res = await EezzeService.doStateUpdate(
						// 	this._connection.dbId,
						// 	result,
						// 	''
						// );

						// console.log('HERE: ' + process.env.EEZZE_HOST_2);

						// console.log('To here: ', result);
					});
				}, delay);
			}
		}
	}
}
