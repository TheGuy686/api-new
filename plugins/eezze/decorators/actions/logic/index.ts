import { isPromise } from '../../../libs/ObjectMethods';
import { ActionDataManager, LogicChain } from '../../../classes';
import { addActionToQueue } from '../ActionDecorators';

interface ListArgsI {
    source: (adm: ActionDataManager, lc?: LogicChain) => object;
    itemSource?: (topItem: any, adm: ActionDataManager, lc?: LogicChain) => any;
    action: (item: any, key: number | string, adm?: ActionDataManager, self?: any,  target?: any) => any;
}

interface DoArgsI {
    run: (adm?: ActionDataManager, lc?: LogicChain) => any;
    onSuccess?: E_CM_CB_VOID;
}

type EWHEN_ACTION = (adm: ActionDataManager, lc?: LogicChain, item?: any, key?: number | string) => any;
type EWHEN_ACTION_ITEM = {
    condition: (adm: ActionDataManager, lc?: LogicChain, item?: any, key?: number | string) => any;
    action: EWHEN_ACTION;
}

interface EWhenArgsI {
    condition?: (adm: ActionDataManager, lc?: LogicChain, item?: any) => boolean;
    source?: (adm?: ActionDataManager, lc?: LogicChain, item?: any) => any[];
    listSource?: (adm: ActionDataManager, lc?: LogicChain) => any[];
    action?: EWHEN_ACTION;
    actions?: EWHEN_ACTION_ITEM[];
}

export function List (params: ListArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function LIST_OR (adm: ActionDataManager) {
            try {
                adm.setAction('LIST_OR: ' + adm.totalActions);

                const list: any = params.source(adm, new LogicChain(adm, this.logger));

                if (!Array.isArray(list)) throw `Decorators.List.Error: "list" source must be an array`;

                for (const k in list) {
                    if (typeof params?.itemSource === 'function') {
                        let itemArr: any;

                        const lc = new LogicChain(adm, this.logger);

                        // call the CB that will return the array source of the inner item
                        itemArr = await params.itemSource(list[k], adm, lc);

                        if (!Array.isArray(itemArr)) {
                            throw `Decorators.List: The inner item of the itemSource is not an array`;
                        }

                        // if the itemSource is supplied then we need to loop over the inner loop of the
                        // itemSource array. Essensially what we're doing is a second loop in the for loop
                        for (const ik in itemArr) {
                            try {
                                // then we run the action on each of the items from the itemArr
                                params.action(itemArr[ik], ik, adm, this, target);
                            }
                            catch (err) {
                                throw `BL.List: Couldn't run you item source action for "${ik}->${JSON.stringify(itemArr[ik])}"`;
                            }
                        }
                    }
                    else {
                        try {
                            params.action(list[k], k, adm, this, target);
                        }
                        catch (err) {
                            throw `BL.List: Couldn't run the action for "${k}->${JSON.stringify(list[k])}"`;
                        }
                    }
                }

                adm.previousStepSuccessful = true;
                adm.setResultInternal(list, 'List');
                this.logger.infoI('Decorators->Logic->List Success', 'Decorators->Logic->List Success', adm, [ 'info' ]);
            }
            catch (e) {
                const em = `Decorators.logic.List.error: "${e.message || e}"`;
                adm.previousStepSuccessful = false;
                adm.setError(em);
                throw em;
            }
        }

        addActionToQueue(target, cb, 'List', params);
    }
}

export function EWhen (params: EWhenArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function EWHEN_OR (adm: ActionDataManager) {
            try {
                adm.setAction('EWHEN_OR: ' + adm.totalActions);

                // this runs multiple when actions
                if (typeof params?.listSource == 'function') {
                    const list: any = params.listSource(adm, new LogicChain(adm, this.logger));

                    if (typeof params?.action == 'undefined' && typeof params?.actions == 'undefined') {
                        throw `Decorators.EWhen.error: At least "action" or and array of "actions" has to be defined`;
                    }

                    if (!Array.isArray(list)) {
                        throw `Decorators.EWhen.Error: "list" source must be an array`;
                    }

                    // if there is a desired circumstance in which all these when actions are run
                    // this could be controlled by the main condition. This will allow us to be
                    // able to have more specific circumstances and control over the business logic
                    if (typeof params?.condition == 'function') {
                        // if the main condition is not satisfied then we just return out of the function
                        if (!params.condition(adm, new LogicChain(adm, this.logger))) {
                            adm.previousStepSuccessful = false;
                            adm.setError(`Decorators.logic.EWhen.condition error: "Condition was not met"`);
                            return;
                        }
                    }

                    for (const k in list) {
                        // run the singular action
                        if (typeof params?.action == 'function') {
                            // only execute the action if the condition is satisfied
                            if (params.condition(adm, new LogicChain(adm, this.logger), k)) {
                                adm.setResultInternal(
                                    params.action(
                                        adm,
                                        new LogicChain(adm, this.logger),
                                        list[k],
                                        k
                                    ), `${k}. EWhen->if 1->for if`);
                            }
                        }
                        else {
                            // apply the list of when conditions to the same item
                            for (const a of params?.actions) {
                                // only apply the action if the action item condition is satisfied
                                if (a.condition(adm, new LogicChain(adm, this.logger), list[k], k)) {
                                    adm.setResultInternal(
                                        a.action(
                                            adm,
                                            new LogicChain(adm, this.logger),
                                            list[k],
                                            k
                                        ), `${k}. EWhen->if 1->for else`);
                                }
                            }
                        }
                    }

                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(true, 'EWhen list of actions');

                    this.logger.infoI('Decorators->Logic->listSource->EWhen Success', 'Decorators->Logic->listSource->EWhen Success', adm, [ 'info' ]);

                    return;
                }

                const source = await params.source(adm, new LogicChain(adm, this.logger));

                try {
                    // run the singular action
                    if (typeof params?.action == 'function') {
                        // only execute the action if the condition is satisfied
                        if (params.condition(adm, new LogicChain(adm, this.logger), source)) {
                            adm.setResultInternal(params.action(adm, new LogicChain(adm, this.logger), source), `EWhen->if 2`);
                        }
                    }
                    else {
                        // apply the list of when conditions to the same item
                        for (const a of params?.actions) {
                            // only apply the action if the action item condition is satisfied
                            if (a.condition(adm, new LogicChain(adm, this.logger), source)) {
                                adm.setResultInternal(a.action(adm, new LogicChain(adm, this.logger), source), `EWhen-> else 2`);
                            }
                        }
                    }

                    adm.previousStepSuccessful = true;
                    this.logger.infoI('Decorators->Logic->listSource->EWhen Success', 'Decorators->Logic->EWhen Success', adm, [ 'info' ]);
                }
                catch(err) {
                    adm.previousStepSuccessful = false;
                    adm.setError(`Decorators.logic.EWhen.error: "${err.message || err}"`);
                    throw new Error(`Decorators.logic.EWhen.error: "${err.message || err}"`);
                }
            }
            catch (e) {
                adm.previousStepSuccessful = false;
                adm.setError(`Decorators.logic.EWhen.error: "${e.message || e}"`);
                throw new Error(`Decorators.logic.EWhen.error: "${e.message || e}"`);
            }
        }

        addActionToQueue(target, cb, 'EWhen', params);
    }
}

export function Do (params: DoArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function LIST_OR (adm: ActionDataManager) {
            try {
                adm.setAction('D_OR: ' + adm.totalActions);

                let resOutput;

                try {
                    resOutput = await params.run(adm, new LogicChain(adm, this.logger));
                    adm.previousStepSuccessful = true;

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }
                    
                    adm.setResultInternal(adm.result, 'Do');
                    this.logger.infoI('Decorators->Logic->listSource->Do Success', 'Decorators->Logic->listSource->Do Success', adm, [ 'info' ]);
                }
                catch (err) {
                    adm.previousStepSuccessful = false;
                    adm.setError(err?.message ?? err);
                    adm.setResultInternal(false, 'Do->Error: catch');
                }
            }
            catch (e) {
                const em = `Decorators.logic.Do.error: "${e.message || e}"`;
                adm.previousStepSuccessful = false;
                adm.setError(em);
                throw em;
            }
        }

        addActionToQueue(target, cb, 'Do', params);
    }
}