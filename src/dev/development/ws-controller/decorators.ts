import { pascalCase } from "@eezze/libs/StringMethods";

interface OnArgsI {event: string}

let serverMain: any;
let eventsMain: any;

export function setEvents(events: any) {eventsMain = events}
export function setServer(server: any) {serverMain = server}

const eventsCache: any = {};

function setEvent(className: string, eventKey: string, callback: Function) {
    if (typeof eventsCache[className] == 'undefined') {
        eventsCache[className] = {};
    }
    if (typeof eventsCache[className][eventKey] == 'undefined') {
        eventsCache[className][eventKey] = [];
    }

    eventsCache[className][eventKey].push(callback);
}

export function SocketContrller(args: any = {}) {
    return function <T extends new (...args: any[]) => {}>(constr: T) {
        const path = args.path ?? '/', classname = constr.name;
        return class ExtendedSocketController extends constr {
            constructor(...args: any[]) {
                super(...args);
                // first we need to get the event que if exists for this controller
                if (typeof eventsCache[classname] == 'object') {
                    // then we need to loop over each event in the que
                    for (const eventName in eventsCache[classname]) {
                        // then we add each of the events to the relevant que's
                        for (const callback of eventsCache[classname][eventName]) {
                            // here we bind the callback to "this" as it looses its context
                            serverMain.on(eventName, callback.bind(this), path);
                        }
                    }
                }
            }
        };
    }
}

export function OnConnection(args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setEvent(target.constructor.name, 'OnConnection', descriptor.value);
    };
}

export function OnDisconnect(args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setEvent(target.constructor.name, 'OnDisconnect', descriptor.value);
    };
}

export function OnMessage(args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setEvent(target.constructor.name, 'OnMessage', descriptor.value);
    };
}

export function On(args: OnArgsI) {
    return function (target: any, propertyKey: string, descriptor: any) {
        setEvent(target.constructor.name, `On${pascalCase(args.event)}`, descriptor.value);
    };
}