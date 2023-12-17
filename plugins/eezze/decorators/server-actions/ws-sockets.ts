import ProjectDependancyCaches from '../../classes/ProjectDependancyCaches';
import SocketActionArgsI from '../../interfaces/SocketActionArgsI';
import WsIntegration from '../../base/datasources/WsIntegration';
import ActionDataManager from '../../classes/ActionDataManager';
import { addActionToQueue } from '..';
import { LogicChain } from '../../classes';

// export async function doAction(
//     ds: any,
//     params: any,
//     headers: any,
//     payload: any,
//     urlParams: any,
//     target: any,
//     adm: ActionDataManager,
// ) {
//     const wsIntegration = new WsIntegration(
//         target.logger,
//         ds.host,
//         adm,
//         headers,
//     );

//     const onSuccessEvent = typeof params?.success !== 'undefined' ? params?.success : `${params?.eventName}-success`,
//         onErrorEvent = typeof params?.error !== 'undefined' ? params?.error : `${params?.eventName}-error`;

//     const res: any = await wsIntegration.run(
//         params.eventName,
//         payload,
//         onSuccessEvent,
//         onErrorEvent,
//         urlParams,
//         params?.asynchronous,
//     );

//     return res;
// }

export function SocketAction (params: SocketActionArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function ServiceCaller_OR (adm: ActionDataManager) {
            adm.setAction('ServiceCaller_OR: ' + adm.totalActions);

            let ds = new (ProjectDependancyCaches.getCachedDs(params.datasource));
            ds = ds.ds.source;

            let headers: any = {}, payload: any = {}, urlParams: any = {};

            if (typeof params?.actionList != 'undefined') {
                let al: any[];

                if (typeof params?.actionList == 'function') {
                    al = await params.actionList(adm, new LogicChain(adm, this.logger));
                }
                else al = params.actionList;

                let results: any[] = [];

                for (const i of al) {
                    if (typeof params?.urlParams == 'function') {
                        urlParams = await params.urlParams(adm, new LogicChain(adm, this.logger), i);
                    }
                    else if (typeof params?.urlParams == 'object') {
                        urlParams = {...(params.urlParams as any)};
                    }

                    if (typeof params?.requestBody == 'function') {
                        payload = {...(await params.requestBody(adm, new LogicChain(adm, this.logger), i))};
                    }
                    else if (typeof params?.requestBody == 'object') {
                        payload = {...(params.requestBody as any)};
                    }

                    const res = await WsIntegration.doAction(
                        ds,
                        params,
                        headers,
                        payload,
                        urlParams,
                        target,
                        adm,
                    );

                    results.push(res);
                }

                if (typeof params?.output == 'function') {
                    results = await params?.output(adm, new LogicChain(adm, this.logger), results);
                }

                adm.previousStepSuccessful = true;
                adm.setResultInternal(results, 'SocketAction');
                adm.setSuccess(`SocketAction finished successfully`);

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }
            }
            else {
                try {
                    if (typeof params?.urlParams == 'function') {
                        urlParams = await params.urlParams(adm, new LogicChain(adm, this.logger));
                    }
                    else if (typeof params?.urlParams == 'object') {
                        urlParams = {...(params.urlParams as any)};
                    }

                    if (typeof params?.requestBody == 'function') {
                        payload = {...(await params.requestBody(adm, new LogicChain(adm, this.logger)))};
                    }
                    else if (typeof params?.requestBody == 'object') {
                        payload = {...(params.requestBody as any)};
                    }

                    let res = await WsIntegration.doAction(
                        ds,
                        params,
                        headers,
                        payload,
                        urlParams,
                        target,
                        adm,
                    );

                    if (typeof params?.output == 'function') {
                        res = await params?.output(adm, new LogicChain(adm, this.logger), res);
                    }

                    adm.previousStepSuccessful = true;
                    adm.setSuccess(`SocketAction finished successfully`);
                    adm.setResultInternal(res, 'SocketAction');

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }
                }
                catch (e) {
                    const em = `Server Action Decorators: SocketAction: "${e.message || e}"`;

                    this.logger.error(`SocketAction error: ${e.message}`, 'Server Action Decorators: SocketAction: catch', adm);

                    adm.previousStepSuccessful = false;
                    adm.setError(em);

                    throw em;
                }
            }
        }

        addActionToQueue(target, cb, 'SocketAction', params);
    };
}