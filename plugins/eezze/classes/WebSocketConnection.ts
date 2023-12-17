import { isPromise } from '../libs/ObjectMethods';
import { ActionDataManager, EezzeWsRequest, Logger } from '../classes';
import { generateRandomString, kebabCase, pascalCase } from '../libs/StringMethods';
import { EWebSocket } from './EWebSocket';

interface ConnectionArgsI {
    logger: Logger;
    adm: ActionDataManager;
    connId: string;
}

// function originIsAllowed(origin) {
//     // put logic here to detect whether the specified origin is allowed.
//     return true;
// }

// if (!originIsAllowed(request.origin)) {
//     // Make sure we only accept requests from an allowed origin
//     request.reject();
//     console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//     return;
// }

export default class WebSocketConnection {
    private __genId: string = generateRandomString(5);
    private _id: string;
    private logger: Logger;
    private _isValidConnection: boolean = false;
    private server: EWebSocket;
    private authenticator: any;
    private connection: any;
    private connectionRequest: EezzeWsRequest;

    public get id() {return this._id}
    public get isValidConnection() {return this._isValidConnection}
    public get connPath() {return this.connectionRequest.urlPath}

    private _subscriptions: any = {};

    private _internalEvents: any = {};

    public get internalEvents() { return this._internalEvents }

    constructor(server: EWebSocket, logger: Logger, authenticator?: any) {
        this.logger = logger;
        this.server = server;

        if (authenticator) {
            this.authenticator = authenticator;
        }
    }

    public setConnectionId(id: string) { this._id = id }

    public finalizeConnection(id: string) {
        if (!this._isValidConnection) {
            this.logger.errorI(`Can't finalize a non initialized connection`, 'WebSocketConnecion->finalizeConnection');
            return;
        }

        this.setConnectionId(id)

        this.setEvents();

        this._subscriptions[this.connPath] = { event: 'Constructor', channel: this.connPath };

        this.server.initChannelState(this.connPath);
        this.server.registerChannel(this.connPath);

        this.server.addChannelSubState(this.connPath, this, this.connectionRequest.auth?.user ?? {});
    }

    public setInternalEvent(path: string, eventName: string, callback: Function) {
        if (typeof this._internalEvents[path] == 'undefined') this._internalEvents[path] = {};
        if (typeof this._internalEvents[path][eventName] == 'function') return;

        this._internalEvents[path][eventName] = callback;
    }

    public async destroy(closeConnection = false, connection: any, ignoreEvents = [ 'Constructor' ]) {
        try {
            const amdDummy = new ActionDataManager(this.connectionRequest, this.logger);

            amdDummy.setState(this.server.state);

            for (const i in this._subscriptions) {
                const s = this._subscriptions[i];

                this.server.unsubscribe(s.channel, this.id);

                if (!ignoreEvents.includes(s.event)) {
                    const evt = `On${s.event}Disconnect`,
                          steChageEvt = `On${pascalCase(s.event)}StateChanged`;

                    const evts = this._internalEvents?.[s.channel],
                          plcb = evts[evt];

                    this.server.removeChannelSubState(s.channel, this);

                    const stateChangeCb = this.internalEvents?.[s.channel]?.[steChageEvt];

                    if (typeof stateChangeCb == 'function') {
                        this.broadcast(
                            kebabCase(steChageEvt.replace(/^On/, '')),
                            this.server.getServerState(s.channel),
                            s.channel
                        );
                    }

                    if (typeof plcb == 'function') {
                        this.broadcast(kebabCase(evt.replace(/^On/, '')), plcb(amdDummy), s.channel );
                    }
                }

                delete this._subscriptions[i];
            }

            if (closeConnection) this.closeConnection();
        }
        catch (err: any) {
            console.log('Error: ', err);
            this.logger.critical(`WebsocketConnection->destroy Error: There was an error trying to destroy your connection: ` + err.message);
        }
    }

    public closeConnection() {
        try {
            this.connection.close();
            this.server.flushConnection(this._id);
        }
        catch (err) {}
    }

    public broadcast(event: string, data: any = {}, path: string = 'v1') {
        this.server.broadcast(
            this.id,
            event,
            data,
            path,
        );
    }

    public async setConnection(adm: ActionDataManager) {
        const request = adm.request;

        const socket = request instanceof EezzeWsRequest ? request.socket : request.request;

        this.connectionRequest = request as any;

        // if (!this.server.checkPath(this.connPath)) {
        //     console.log(`Path "${this.connPath}" was not a valid path`);
        //     return false;
        // }

        if (this?.authenticator) {
            adm.setState(this.server.state);

            try {
                // this is where we initialize the authenticator and inject the request into the authenticator
                this.authenticator = new (this?.authenticator)(adm);

                if (!await this?.authenticator.validate(adm)) {
                    this.logger.errorI(`Connection rejected: invalid Authorization token`, 'WebsocketConnection: setConnection: Authentication rejected');
                    return;
                }
                else {
                    this.connection = socket.accept(null, socket.host);
                    await this.authenticator.serialize(adm, 'setConnection');
                    this.logger.infoI(`"${(new Date())}" Received a new connection from origin "${socket.host}"`);
                }
            }
            catch (e) {
                console.log('Error: ', e);
                this.logger.critical(`WebSocketConnection->setConnection: Critical error in WS connection authentication: ${e.message}`);
                return false;
            }
        }
        // here we just need to accept the connection regardless if there is no authentication required
        else {
            this.connection = socket.accept(null, socket.host);
            this.logger.infoI(`New connection`);
        }

        this.server.emit(
            'OnConnection',
            this,
            {},
            this.connPath,
        );

        this._isValidConnection = true;
        // this.server.incrementTotal();

        return true;
    }

    public subscribeToChannel(event: string, channel: string, adm: ActionDataManager) {
        this.server.subscribeToChannel(channel, this, adm, event);
        this._subscriptions[channel] = { event, channel };

        const evt       = `On${event}Connection`,
              emStaeEvt = `On${event}StateChanged`;

        const emitStateCb = this._internalEvents?.[channel]?.[emStaeEvt];
        const doStateEmit = typeof emitStateCb == 'function';

        const evts = this._internalEvents?.[channel],
              plcb = evts[evt];

        if (typeof plcb == 'function' || doStateEmit) {
            const e  = doStateEmit ? emStaeEvt   : evt;
            const cb = doStateEmit ? emitStateCb : plcb;

            const pl = doStateEmit ? this.server.getServerState(channel) : cb(adm);

            this.server.broadcastState(this.id, emStaeEvt, pl, channel);
        }
    }

    private setEvents() {
        this.connection.on('message', async (data: any) => {
            try {
                data = JSON.parse(data.utf8Data);

                if (typeof data.event == 'undefined') {
                    throw new Error(`WebsocketConnection.Error: No "event" element in data object`);
                }

                this.connectionRequest.requestBody = data.data;

                await this.server.emit(
                    `On${pascalCase(data.event)}`,
                    this,
                    {
                        success: true,
                        data: data.data,
                    },
                    this.connPath,
                );

                return;
            }
            catch (e) {
                console.log('ERROR: ', e);
                console.log('Data: ', data);
                // console.log(`Message parsing error: "${JSON.stringify(data)}"`);

                // this.logger.warnI(`WebsocketConnection:setEvents: Message was malformed. Got: "${JSON.stringify(data)}"`);
            }

            await this.server.emit(
                'OnMessage',
                this, {
                    success: false,
                    data: data.utf8Data,
                },
                this.connPath,
            );
        });

        this.connection.on('close', async (conn: any) => {
            this.logger.warnI(`Closed connection from "${this.connectionRequest.requestIp}:${this.connectionRequest.fullUrl}" from connection close from client side`);

            await this.destroy(false, conn);

            await this.server.emit(
                'OnDisconnect',
                this,
                {},
                this.connPath,
            );

            this.closeConnection();

            // this.server.deincrementTotal();
            this.logger.warnI(`"${(new Date())}" Peer ${conn.remoteAddress} disconnected`);
        });
    }

    public emit(event: string, data: any) {
        const pl: any = {
            event,
            _connectionId: this._id,
            data
        };
// console.log('Emit: ', this.__genId, ' : ', this._id, ' : ', JSON.stringify(pl));
        this.connection.send(JSON.stringify(pl));
    }
}