import { addActionToQueue } from '..';
import { Service } from '../../../classes/ServiceBus';
import { eexec } from '../../../libs/Command';
import { skipOn } from '..';

import ADM from '../../../classes/ActionDataManager';
import LogicChain from '../../../classes/logic/LogicChain';

interface ServicecCallerArgsI {
    service: string;
    skipOn?: ECONDITIONAL_ITEM[];
    headers?: E_CM_CB_OBJ | object;
    urlParams?: E_CM_CB_OBJ | object;
    requestBody?: E_CM_CB_OBJ | object;
    actionListSource?: E_CM_CB_OBJ;
    output?: E_CM_CB_ANY;
    failOn?: ECONDITIONAL_ITEM[];
    onSuccess?: E_CM_CB_VOID;
    onError?: E_CM_CB_VOID;
    debug?: boolean;
    condition?: E_CM_CB_BOOL;
}

interface CommandArgsI {
    rootFolder?: E_CM_CB_STR | string;
    isAsync?: boolean;
    command?: E_CM_CB_STR | string;
    output?: E_CM_CB_ANY;
    onSuccess?: E_CM_CB_VOID;
}

interface DataTransformerArgsI {
    output: E_CM_CB_ANY;
    onSuccess?: E_CM_CB_VOID;
}

export function ServiceCaller (params: ServicecCallerArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function ServiceCaller_OR (adm: ADM) {
            adm.setAction('ServiceCaller_OR: ' + adm.totalActions);

            if (typeof params?.skipOn != 'undefined' && await skipOn(params, adm)) {
                return;
            }

            if (params?.actionListSource) {
                const results: any = [];

                try {
                    const items: any[] = [
                        ...(
                            JSON.parse(
                                JSON.stringify(
                                    params?.actionListSource(
                                        adm,
                                        new LogicChain(adm, this.logger)
                                    )
                                )
                            )
                        )
                    ];

                    for (const item of Object.values(items)) {
                        if (typeof params?.condition == 'function' && !await params.condition(adm, new LogicChain(adm, this.logger), item)) {
                            continue;
                        }

                        let pl: any = {
                            headers: {},
                            urlParams: {},
                            requestBody: {},
                        };

                        let appliedCbs: boolean = false;

                        if (typeof params?.headers == 'function') {
                            pl.headers = {...await params?.headers(
                                adm,
                                new LogicChain(adm, this.logger),
                                item,
                            )};
                            appliedCbs = true;
                        }
                        else if (typeof params?.headers == 'object') {
                            pl.headers = {...(params.headers as object)};
                            appliedCbs = true;
                        }

                        if (typeof params?.urlParams == 'function') {
                            pl.urlParams = {...await params?.urlParams(
                                adm,
                                new LogicChain(adm, this.logger),
                                item,
                            )};
                            appliedCbs = true;
                        }
                        else if (typeof params?.urlParams == 'object') {
                            pl.urlParams = {...(params.urlParams as object)};
                            appliedCbs = true;
                        }

                        if (typeof params?.requestBody == 'function') {
                            pl.requestBody = {...await params?.requestBody(
                                adm,
                                new LogicChain(adm, this.logger),
                                item,
                            )};
                            appliedCbs = true;
                        }
                        else if (typeof params?.requestBody == 'object') {
                            pl.requestBody = {...(params.requestBody as object)};
                            appliedCbs = true;
                        }

                        // we need to look into this. I'm not sure assuming the previous action output as the next input is the best
                        if (!appliedCbs) {
                            pl = JSON.parse(JSON.stringify(adm.nextActionInput));
                        }

                        let res = await Service(params?.service, pl, params?.debug ?? false, adm) as any;

                        if (typeof params?.output === 'function') {
                            const lc = new LogicChain(adm, this.logger);
                            res = {...await params.output(adm, lc, res)};
                        }
                        else {
                            results.push(res.toObject().body);
                        }
                    }
                }
                catch (e) {
                    adm.previousStepSuccessful = false;
                    adm.setError(`ServiceCaller.actionListSource.error: ${e.message ?? e}`);
                    throw `ServiceCaller.actionListSource.error: ${e.message ?? e}`;
                }

                adm.previousStepSuccessful = true;
                adm.setSuccess(`ServiceCaller.actionListSource: Successfully called all your services`);
                adm.setResultInternal(results, 'ServiceCaller->if');

                if (Array.isArray(params?.failOn)) {
                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setResultInternal({}, 'ServiceCaller');
                                throw `ServiceCaller "failOn" condition was satisfied`;
                            }
                        }
                        else {
                            if (await cond.condition(adm, new LogicChain(adm, this.logger))) {
                                let msg = '';
    
                                if (typeof cond.message == 'function') {
                                    msg = await cond.message(adm, new LogicChain(adm, this.logger));
                                }
                                else msg = cond.message;
    
                                adm.previousStepSuccessful = false;
                                adm.setResultInternal({}, 'ServiceCaller');
    
                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                throw msg;
                            }
                        }
                    }
                }

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->ServiceCaller Success', this, adm, [ 'info' ]);
            }
            else {
                try {
                    if (typeof params?.condition == 'function') {
                        throw `ServiceCaller.condition.error: Condition is only supported for actionListSource`;
                    }

                    const pl: any = {
                        headers: {},
                        urlParams: {},
                        requestBody: {},
                    };

                    if (typeof params?.headers == 'function') {
                        pl.headers = {...await params?.headers(adm, new LogicChain(adm, this.logger))};
                    }
                    else if (typeof params?.headers == 'object') {
                        pl.headers = {...(params.headers as object)};
                    }

                    if (typeof params?.urlParams == 'function') {
                        pl.urlParams = {...await params?.urlParams(adm, new LogicChain(adm, this.logger))};
                    }
                    else if (typeof params?.urlParams == 'object') {
                        pl.urlParams = {...(params.urlParams as object)};
                    }

                    if (typeof params?.requestBody == 'function') {
                        pl.requestBody = {...await params?.requestBody(adm, new LogicChain(adm, this.logger))};
                    }
                    else if (typeof params?.requestBody == 'object') {
                        pl.requestBody = {...(params.requestBody as object)};
                    }

                    let res: any = await Service(params?.service, pl, false, adm);

                    if (!res.success) throw res.body;

                    adm.previousStepSuccessful = true;

                    if (typeof params?.output === 'function') {
                        res = await params.output(adm, new LogicChain(adm, this.logger), res.toObject());

                        adm.setSuccess(`ServiceCaller.payload: Successfully called your service`);
                        adm.setResultInternal(res, 'ServiceCaller->else');
                    }
                    else {
                        adm.setSuccess(`ServiceCaller.payload: Successfully called your service`);
                        adm.setResultInternal(JSON.parse(res.body), 'ServiceCaller->else');
                    }

                    if (Array.isArray(params?.failOn)) {
                        for (const cond of params.failOn) {
                            if (typeof cond == 'function') {
                                if (await cond(adm, new LogicChain(adm, this.logger))) {
                                    adm.previousStepSuccessful = false;
                                    adm.setResultInternal({}, 'ServiceCaller');
                                    throw `ServiceCaller "failOn" condition was satisfied`;
                                }
                            }
                            else {
                                if (await cond.condition(adm, new LogicChain(adm, this.logger))) {
                                    let msg = '';
        
                                    if (typeof cond.message == 'function') {
                                        msg = await cond.message(adm, new LogicChain(adm, this.logger));
                                    }
                                    else msg = cond.message;
        
                                    adm.previousStepSuccessful = false;
                                    adm.setResultInternal({}, 'ServiceCaller');
        
                                    adm.setError(msg);
                                    adm.previousStepSuccessful = false;
                                    throw msg;
                                }
                            }
                        }
                    }

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }

                    this.logger.info('Decorators->ServiceCaller Success', this, adm, [ 'info' ]);
                }
                catch (e) {
console.log('Service caller Error: ', e);
                    // if (typeof params?.onError == 'function') {
                    //     if (isPromise(params?.onError)) {
                    //         await params?.onError(e, adm);
                    //     }
                    //     else {
                    //         params?.onError(e, adm);
                    //     }
                    // }

                    const em = `ServiceCaller.error:There was an error calling your service`;
                    adm.previousStepSuccessful = false;
                    adm.setError(em);
                    throw em;
                }
            }
        }

        addActionToQueue(target, cb, 'ServiceCaller', params);
    }
}

export function DataTransformer (params: DataTransformerArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function DataTransformer_OR (adm: ADM) {

            try {
                adm.setAction('DataTransformer_OR: ' + adm.totalActions);

                adm.previousStepSuccessful = true;

                let outputRes: any;

                outputRes = await params.output(adm, new LogicChain(adm, this.logger));

                adm.setResultInternal(outputRes, 'DataTransformer');

                this.logger.info('Decorators->DataTransformer Success', this, adm, [ 'info' ]);
            }
            catch (e) {
                adm.previousStepSuccessful = false;
                adm.setError(`Data transformation error: "${e.message || e}"`);
            }
        };

        addActionToQueue(target, cb, 'DataTransformer', params);
    }
}

export function Command (params: CommandArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function Command_OR (adm: ADM) {
            let cmd, command: any;

            try {
                adm.setAction('Command_OR: ' + adm.totalActions);

                if (typeof params.command == 'function') {
                    command = await params.command(adm, new LogicChain(adm, this.logger));
                }
                else command = params.command;

                // only go to root folder if passed as a param
                if (typeof params.rootFolder == 'function') {
                    const rootFolder = await params.rootFolder(
                        adm,
                        new LogicChain(adm, this.logger)
                    );

                    await eexec(`cd ${rootFolder}`);
                }
                else if (typeof params.rootFolder == 'string') {
                    await eexec(`cd ${params.rootFolder, command}`);
                }

                this.logger.infoI(`Command: Running cmd "${command}"`);

                let res;

                if (params?.isAsync) {
                    res = require('child_process').exec(command);
                }
                else res = await eexec(command);

                if (!res.success) {
                    adm.previousStepSuccessful = false;
                    adm.setError(res.error);
                    return;
                }

                this.logger.infoI(res);

                adm.previousStepSuccessful = true;

                adm.setSuccess(`Successfully ran cmd "${command}"`);

                if (typeof params?.output === 'function') {
                    adm.setResultInternal(
                        await params.output(adm, new LogicChain(adm, this.logger), res),
                    'Command');
                }
                else adm.setResultInternal(res.stdout, 'Command');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->Command Success', this, adm, [ 'info' ]);
            }
            catch (e) {
                adm.previousStepSuccessful = false;
                adm.setError(`Decorators->Command.misc.error: There was an error running "${cmd}", error: "${e.message || e}"`);
            }
        };

        addActionToQueue(target, cb, 'Command', params);
    }
}