import { setServiceAccessArgs } from '../../decorators';
import { pascalCase } from '../../libs/StringMethods';
import { getClassNameFromObjString } from '../../libs/ClassMethods';
import { getLogger } from '../..';
import ProjectDependancyCaches from '../../classes/ProjectDependancyCaches';
import ServiceBus from '../../classes/ServiceBus';
import ServiceDefault from '../../classes/defaults/ServiceDefault';
import LogicChain from '../../classes/logic/LogicChain';

interface OnArgsI {
    event: string;
    success?: string;
    fail?: string;
    broadcast?: boolean;
}

interface BroadcastArgsI extends OnArgsI {
    channel?: E_CM_CB_STR | string;
}

interface NotifyArgsI extends OnArgsI {
    channel?: E_CM_CB_STR | string;
    connection?: E_CM_CB_STR | string;
}

interface ChannelArgsI {
    id: string;
    success?: string;
    fail?: string;
    channel: E_CM_CB_STR | string;
    user?: E_CM_CB_OBJ;
    emitState?: boolean;
    onConnection?: E_CM_CB_OBJ;
    onDisconnect?: E_CM_CB_OBJ;
}

const eventsCache: any = {}, internalEventsCache: any = {};

function setEvent(className: string, eventKey: string, callback: Function) {
    if (typeof eventsCache[className] == 'undefined') {
        eventsCache[className] = {};
    }

    if (typeof eventsCache[className][eventKey] == 'undefined') {
        eventsCache[className][eventKey] = [];
    }

    eventsCache[className][eventKey].push(callback);
}

function setWsCb(args: any, target: any, propertyKey: string, descriptor: PropertyDescriptor, emitDefaultEvents: boolean = false, eventType: string) {
    if (typeof target.logger == 'undefined') target.logger = getLogger();
    if (typeof args.group    == 'undefined') args.group    = target.group;

    setServiceAccessArgs(propertyKey, args);

    const serviceName = getClassNameFromObjString(target);

    const serviceConfig: any = ProjectDependancyCaches.getServiceConfig(
        serviceName.replace(/Controller$/, ''),
        'RestfulApiDecorators: route',
    );

    ServiceBus.registerService(
        serviceName,
        serviceConfig,
        propertyKey,
        {
            type: 'websocket',
            method: args.method,
            eventType,
            event: args?.event,
            success: args?.success,
            fail: args?.fail,
            path: `/v${serviceConfig.version + (args.path ? args.path : '')}`,
        },
    );

    if (!target.mainClassName) {
        target.mainClassName = getClassNameFromObjString(target);
        target.group         = target.mainClassName.replace(/Controller$/, '');
    }

    descriptor.value = async function (socket: any, payload: any) {
        try {
            this.logger.debugI(`${target.mainClassName} > ${args?.event?.toUpperCase()}:${propertyKey} CALLED`, this);

            const er = socket.connectionRequest;

            er.requestSrcId = target.id;

            this.logger.srcRequest = er;

            let authentication;

            if (serviceConfig.services && typeof serviceConfig.services !== 'undefined' && typeof serviceConfig.services[propertyKey] !== 'undefined') {
                authentication = serviceConfig.services[propertyKey].authenticator;
            }

            const res: any = await new ServiceDefault({
                serviceId: propertyKey,
                authenticator: authentication,
            }).run(er, this.server);

            let channel;

            const hasConnectionEvent = typeof args?.onConnection == 'function';

            if (typeof args?.channel == 'function') {
                channel = `/v${serviceConfig.version}/${(await args.channel(res.adm, new LogicChain(res.adm, this.logger)) ?? '').replace(/^\//, '')}`;
            }
            // default to the lastest version of the default channel
            else channel = `/v${serviceConfig.version}`;

            if (typeof args?.internalEvents == 'object' && Object.keys(args?.internalEvents).length > 0) {
                // first loop all of the event objects in the connection internalEvents
                for (const p in args?.internalEvents) {
                    // then we need loop over all of the functions in the event group
                    for (const e in args?.internalEvents[p]) {
                        socket.setInternalEvent(channel, p, args?.internalEvents[p][e]);
                    }
                }
            }

            if (typeof args?.channel == 'function') {
                if (args?.subscribe) socket.subscribeToChannel(
                    pascalCase(args.event),
                    channel,
                    res.adm
                );
            }

            // const reqResponse: any = new RequestResponse(res.result);

            const body = res?.result?.body ?? {};

            if (res?.result?.success) {
                if (args?.targetConnection) {
                    const ccb = args.targetConnection;

                    const conId = await ccb(res.adm, new LogicChain(res.adm, this.logger));
                    const conn = this.server.socket.getConnection(conId);

                    if (conn) {
                        return await conn.emit(args.event, res?.adm?.result ?? {});
                    }
                    else {
                        this.logger.warnI(`WebsocketDecorators->setWsCb Error: could not find the connection for id "${conId}"`);
                    }
                }

                if (args?.broadcast) {
                    if (!hasConnectionEvent && !args?.emitState) {
                        socket.broadcast(args.event, body, channel);
                    }
                }

                if (args?.success) {
                    return socket.emit(args?.success, body);
                }
                else if (emitDefaultEvents) {
                    return socket.emit(`${args.event}-success`, body);
                }
            }
            else {
                if (args?.fail) {
                    return socket.emit(args?.fail, body);
                }
                else if(emitDefaultEvents) return socket.emit(`${args.event}-error`, body);
            }
        }
        catch (err) {
            console.log('Websocket Decorators Error: ', err);
        }
    };
}

export function SocketController(cntArgs: any = {}) {
    return function <T extends new (...args: any[]) => {}>(constr: T) {
        const path = cntArgs.path ?? '/', classname = constr.name;
        const server = ProjectDependancyCaches.getServer(cntArgs.server);

        Object.defineProperty(constr, 'props', {
            value: cntArgs,
            writable: false
        });

        return class ExtendedSocketController extends constr {
            server = server;

            constructor(...args: any[]) {
                super(...args);

                let serviceConfig;

                try {
                    serviceConfig = args[0].serviceConfig;
                }
                catch (e) {
                    console.log(`SocketController:ExtendedConstructor: Can't find serviceConfig for "${constr.name}"`);
                }

                // first we need to get the event queue if exists for this controller
                if (typeof eventsCache[classname] == 'object') {
                    // then we need to loop over each event in the queue
                    for (const eventName in eventsCache[classname]) {
                        // then we add each of the events to the relevant que's
                        for (const callback of eventsCache[classname][eventName]) {
                            const p = `${serviceConfig?.version ? `/v${serviceConfig?.version}` : ''}${path}`;
                            // here we bind the callback to "this" as it looses its context
                            server.socket.on(eventName, callback.bind(this), p);
                        }
                    }
                }
            }
        };
    }
}

export function OnConnection(args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            { 
                event: 'OnConnection', 
                broadcast: !!args?.broadcast
            },
            target,
            propertyKey,
            descriptor,
            false,
            'OnConnection'
        );
        setEvent(target.constructor.name, 'OnConnection', descriptor.value);
    };
}

export function OnDisconnect(args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            {
                event: 'OnDisconnect',
                broadcast: !!args?.broadcast
            },
            target,
            propertyKey,
            descriptor,
            false,
            'OnDisconnect'
        );
        setEvent(target.constructor.name, 'OnDisconnect', descriptor.value);
    };
}

export function OnMessage(args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            {
                event: 'OnMessage',
                broadcast: !!args?.broadcast
            },
            target,
            propertyKey,
            descriptor,
            false,
            'OnMessage'
        );
        setEvent(target.constructor.name, 'OnMessage', descriptor.value);
    };
}

export function On(args: OnArgsI) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            {
                ...args,
                broadcast: !!args?.broadcast
            },
            target,
            propertyKey,
            descriptor,
            true,
            'On'
        );
        setEvent(target.constructor.name, `On${pascalCase(args.event)}`, descriptor.value);
    };
}

export function Broadcast(args: BroadcastArgsI) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            {
                ...args,
                broadcast: true
            },
            target,
            propertyKey,
            descriptor,
            false,
            'Broadcast'
        );
        setEvent(target.constructor.name, `On${pascalCase(args.event)}`, descriptor.value);
    };
}

export function OnStats(args: BroadcastArgsI) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            {
                ...args,
                broadcast: true
            },
            target,
            propertyKey,
            descriptor,
            false,
            'OnStats',
        );
        setEvent(target.constructor.name, `On${pascalCase(args.event)}`, descriptor.value);
    };
}

export function Notify(args: NotifyArgsI) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setWsCb(
            {
                ...args,
                broadcast: false,
                targetConnection: args.connection
            },
            target,
            propertyKey,
            descriptor,
            false,
            'f'
        );
        setEvent(target.constructor.name, `On${pascalCase(args.event)}`, descriptor.value);
    };
}

export function Channel(args: ChannelArgsI) {
    return function (target: any, propertyKey: string, descriptor: any) {
        const internalEvents: any = {};

        const emitState = !!args?.emitState;

        const usrEvt = `${pascalCase(args.id)}User`;

        if (!internalEvents[usrEvt]) internalEvents[usrEvt] = {};

        internalEvents[usrEvt].user = args.user;

        if (args?.onConnection) {
            const evt = `On${pascalCase(args.id)}Connection`;

            if (!internalEvents[evt]) internalEvents[evt] = {};

            // we do this because these callbacks only return the payload of what to emit when
            // these events happen. But when we emit the state we just emit the user and the state
            // of the socket server with the On${Channel}StateChanged event
            internalEvents[evt].onConnection = emitState ? args.user : args.onConnection;
        }

        if (emitState && (typeof args?.onConnection == 'function' || typeof args?.onDisconnect == 'function')) {
            target.logger.warnI(`WebsocketDecorators->Channel: Cannot set any other events if "emitState" is set to true. This is because all channel information gets set out with the channel state`);
        }

        if (args?.onDisconnect) {
            const evt = `On${pascalCase(args.id)}Disconnect`;

            if (!internalEvents[evt]) internalEvents[evt] = {};

            // we do this because these callbacks only return the payload of what to emit when
            // these events happen. But when we emit the state we just emit the user and the state
            // of the socket server with the On${Channel}StateChanged event
            internalEvents[evt].onDisconnect = emitState ? args.user : args.onDisconnect;
        }

        if (emitState) {
            const evt = `On${pascalCase(args.id)}StateChanged`;

            if (!internalEvents[evt]) internalEvents[evt] = {};

            internalEvents[evt].onStateChange = args.user;
        }

        setWsCb(
            {
                ...args,
                event: args.id,
                broadcast: true,
                subscribe: true,
                internalEvents,
            },
            target,
            propertyKey,
            descriptor,
            false,
            'Channel'
        );
        setEvent(target.constructor.name, `On${pascalCase(args.id)}`, descriptor.value);
    };
}