import Logger from './Logger';

const W3CWebSocket = require('websocket').w3cwebsocket;

type VALID_EVENT_NAME_TYPES = string | string[];

interface ESocketArgsI {
	fullUrl?: string;
	host?: string;
	port?: number;
	path?: string;
	urlParams?: string;
	logger: Logger;
	autoReconnect?: boolean;
	surpressLogging?: boolean;
}

export default class ESocket {
	private _srcId: string = 'ESocket';
	private logger: Logger;
	private socket: any = null;
	private _isConnected: Boolean = false;
	private events: any = {};
	private autoReconnect: boolean = true;
	private autoReconnectDelay: number = 5000;
	private tmr: any;
	private onConnectCb: Function;
	private surpressLogging: boolean = false;

	private _onConnect: Function;
	private _onDisconnect: Function;

	constructor (args: ESocketArgsI) {

		this.logger = args.logger;
		this.autoReconnect = args?.autoReconnect ?? false;

		if (typeof args?.surpressLogging == 'boolean') {
			this.surpressLogging = args?.surpressLogging;
		}

		// this.connect(args);

		return this;
	}

    public get isConnected() {return this._isConnected}

	connect (args: ESocketArgsI, events: any = {}) {
		if (this.isConnected) return;

		if (typeof events.onConnect == 'function') {
			this._onConnect = events.onConnect;
		}

		if (typeof events.onDisconnect == 'function') {
			this._onDisconnect = events.onDisconnect;
		}

		try {
			let url: string;

			if (args.fullUrl) {
				url = args.fullUrl;
			}
			else {
				// 'ws://' +
				url = args.host + (args?.port ? `:${args.port}${args.path ? `${args.path}` : ''}${args.urlParams ? `?${args.urlParams}` : ''}` : '');
			}

			if (!this.surpressLogging) this.logger.warnI(`ESocket:connect: ${url}`);

			const socket = new W3CWebSocket(url);

			this.socket = socket;

			const self = this;

			socket.onopen = function () {
				if (!self.surpressLogging) self.logger.infoI(`CONNECTED TO SERVER: ${url}`);

				self._isConnected = true;

				self.initSocket();

				self.logger.infoI(`ESocket: Connected to "${url}"`, this);

				if (this._onConnect) this._onConnect();
			};

			this.socket.onerror = () => {
				if (!self.surpressLogging) self.logger.errorI(`Connection Error: ${url}`, 'ESocket: onerror');

				self._isConnected = false;

				self.resetTmr(args);
			};

			this.socket.onclose = () =>	{
				self._isConnected = false;

				self.resetTmr(args);

				if (self._onDisconnect) self._onDisconnect();

				self.logger.infoI(`ESocket: Disconnected from "${url}"`);
			};
		}
		catch (e) {
			console.log('ESocket:connect: ', e);

			if (!this.surpressLogging) this.logger.errorI('Error: ' + e.message, 'ESocket: connect: catch');
		}
	}

	initSocket() {
		if (typeof this.onConnectCb == 'function') {
			this.onConnectCb();
		}

		const self = this;

		this.socket.onmessage = (e: any) => {
			if (typeof e.data === 'string') {
				let evt;

				try {
					evt = JSON.parse(e.data);

					let eventName, data;

					if (typeof evt.eventName != 'undefined') eventName = evt.eventName;
					if (typeof evt.data      != 'undefined') data      = evt.data;

					this.emit(eventName, data);
				}
				catch (e) {
					console.log('ESocket:initSocket: ', e);

					if (!self.surpressLogging) self.logger.errorI('Error: ', e.message);
				}
			}
		};
 	}

	onConnect(cb: Function) {this.onConnectCb = cb}

	on (eventName: any, cb: Function) {
		this.events[eventName] = this.events[eventName] || [];

		this.events[eventName][String(cb)] = cb;
	}

	off (eventName: string, cb: Function) {
		if (this.events[eventName][String(cb)]) {
			delete this.events[eventName][String(cb)];
		}
	}

	emit (eventName: string, data: any) {
		if (typeof this.events[eventName] != 'undefined') {
			let k;

			for (k in this.events[eventName]) {
				this.events[eventName][k](data);
			}
		}
	}

	emitToServer (eventName: VALID_EVENT_NAME_TYPES, data: any = {}){
		if (!this.isConnected) {
			if (!this.surpressLogging) this.logger.warnI(`COULD NOT CALL "${eventName}" AS SOCKET IS NOT CONNECTED`);
			return;
		}
		try {
			// @Ryan - The eventName needs to be removed. This is just here for the time being to make sure we dont break a load of other stuff
			if (typeof eventName == 'object') {
				for (const en of eventName) {
					this.socket.send(JSON.stringify({ event: en, eventName: en, data }));
				}
			}
			else {
				this.socket.send(JSON.stringify({ event: eventName, eventName, data }));
			}
		}
		catch (e) {
			console.log('ERROR emitToServer: ', e.message);
		}
	}

	resetTmr(args: ESocketArgsI) {
		if (this.autoReconnect) {
			if (this.tmr) clearTimeout(this.tmr);
			// console.log('Reconnecting');
			this.tmr = setTimeout(() => this.connect(args), this.autoReconnectDelay);
		}
	}
}