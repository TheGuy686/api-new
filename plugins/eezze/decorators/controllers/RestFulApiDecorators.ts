import RouteArgsI from '../../interfaces/RouteArgsI';
import EezzeRequest from '../../classes/EezzeRequest';
import ServiceDefault from '../../classes/defaults/ServiceDefault';
import ServiceBus from '../../classes/ServiceBus';
import ProjectDependancyCaches from '../../classes/ProjectDependancyCaches';
import { setServiceAccessArgs } from '../ServiceDecorators';
import { RestfulResponse } from '../../libs/Responses';
import { getClassNameFromObjString } from '../../libs/ClassMethods';
import { Logger } from '../../classes';

function route(args: RouteArgsI, target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value.bind(target);

    if (typeof args.group == 'undefined') args.group = target.group;

    setServiceAccessArgs(propertyKey, args);

    let serviceName = getClassNameFromObjString(target), server: any;

    try {
        const controllerRouteArgs = ProjectDependancyCaches.getControllerArgs(serviceName.replace(/Controller$/, ''));
        server = ProjectDependancyCaches.getServer(controllerRouteArgs.server);
    }
    catch (e) {
        console.log(e);
        throw new Error(`RestFulApiDecorators->route: Server "eezze-rest-api" did not exist: ${JSON.stringify(args)}`);
    }

    const serviceConfig: any = ProjectDependancyCaches.getServiceConfig(
        serviceName.replace(/Controller$/, ''),
        'RestfulApiDecorators: route'
    );

    const fullPath = `/v${serviceConfig.version + (args.path ? args.path : '')}`;

    ServiceBus.registerService(
        serviceName,
        serviceConfig,
        propertyKey, {
            type: 'restful',
            method: args.method,
            path: fullPath,
        }
    );

    if (!target.mainClassName) {
        target.mainClassName = getClassNameFromObjString(target);
        target.group = target.mainClassName.replace(/Controller$/, '');
    }

    descriptor.value = async function (req: any, res: any) {
        const l = this.logger as Logger

        l.debugI(`${target.mainClassName} > ${args.method.toUpperCase()}:${propertyKey} CALLED`, this);

        const er = new EezzeRequest(req, res, target.logger);

        er.requestSrcId = target.id;

        target.logger.srcRequest = er;

        let authentication;

        if (typeof serviceConfig.services !== 'undefined' && typeof serviceConfig.services?.[propertyKey] !== 'undefined') {
            authentication = serviceConfig.services?.[propertyKey].authenticator;
        }

        const service: any = await new ServiceDefault({
            serviceId: propertyKey,
            authenticator: authentication
        });

        const r = await service.run(er, server.erouter);

        l.info(`REST: ${args.method.toUpperCase()} "${fullPath}"`, 'RestFulApiDecorators->route', r.adm, [ 'info' ]);

        return new RestfulResponse(er, r.result);
    };

    const config: any = ProjectDependancyCaches.getServiceConfig(target.group);

    server.erouter.addRoute(
        args.method,
        `${config && config?.version ? `/v${config?.version}` : ''}${args.path}`,
        descriptor.value.bind(target),
        propertyKey
    );
}

export function EController(args: any = {}) {
    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        Object.defineProperty(constructor, 'props', {
            value: args,
            writable: false
        });
    }
}

export function EGet(args: RouteArgsI) {
    args.method = 'get';
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return route(args, target, propertyKey, descriptor);
    };
}

export function EPost(args: RouteArgsI) {
    args.method = 'post';
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return route(args, target, propertyKey, descriptor);
    };
}

export function EPut(args: RouteArgsI) {
    args.method = 'put';
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return route(args, target, propertyKey, descriptor);
    };
}

export function EDelete(args: RouteArgsI) {
    args.method = 'delete';
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return route(args, target, propertyKey, descriptor);
    };
}

export function ERoute(args: RouteArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return route(args, target, propertyKey, descriptor);
    };
}