import { kebabCase } from '../../libs/StringMethods';
import { InternalServerErrorResponse, SuccessResponses,  } from '../../classes/ActionResponses';
import { getLogger } from '../..';
import { ActionDataManager, LogicChain } from '../../classes';
import { ExceptionI } from '../../interfaces';

import PDC from '../../classes/ProjectDependancyCaches';

type ROLES = string[];

// const start = performance.now();
// const result = originalMethod.apply(this, args);
// const finish = performance.now();
// console.log(`Execution time: ${finish - start} milliseconds`);

/**
 *
 */
interface EActionI {
    targetRepo?: string;
    roles?: ROLES;
    datasources?: string[];
    repos?: string[];
    condition?: (adm: ActionDataManager, lc?: LogicChain) => (boolean | any);
    exceptions?: ExceptionI[]
}

interface EModelActionI {targetEntity: string;}

interface WhenI {
    roles?: ROLES;
    hook: HOOK_TYPES;
    condition: (fact: any) => boolean;
    onPassThrow?: any;
}

interface OnEventActionI {
    roles?: ROLES;
    event: string;
}

interface SuccessArgsI {message?: string;}

const whenEventsCache: any = {},
    onEventActionsEventsCache: any = {};

type HOOK_TYPES = 'pre' | 'post' | 'preActionConditions';

const actionChainCache: any = {};

export function addActionToQueue(target: any, cb: Function, src: string, params: any) {
    if (!actionChainCache[target.constructor.name]) {
        actionChainCache[target.constructor.name] = [];
    }
    actionChainCache[target.constructor.name].push({
        index: actionChainCache[target.constructor.name].length,
        src,
        params,
        cb,
    });
}

/**
 * @param key
 * @param hook
 * @param propertyKey
 * @param condition
 * @param result
 */
function addEventsToWhenQue(
    key: string,
    hook: HOOK_TYPES,
    propertyKey: string,
    condition: (fact?: any) => boolean,
    result: any,
    roles?: ROLES,
) {
    if (typeof whenEventsCache[key] == 'undefined') {
        whenEventsCache[key] = {
            pre: {},
            post: {},
            preActionConditions: {},
        };
    }

    whenEventsCache[key][hook][`when-${propertyKey}`] = {
        roles: roles ?? [],
        condition,
        result,
    };
}

/*
    @Eezze call stack: This is where we add the onEvent to the modelAction.
    This will get called in the ModelAction:run function
*/
export function applyOnEventActionToContext(mainActionKey: string, context: any) {
    if (typeof onEventActionsEventsCache[mainActionKey] != 'object') {
        return;
    }

    if (typeof context.addOnEventRules != 'function') {
        return getLogger().critical(`Action Decorators->applyOnEventActionToContext: "addOnEventRules" DID NOT EXIST ON THE GIVEN CONTEXT. COULDNT INITALIZE YOU "When" decorator actions`);
    }

    const events = onEventActionsEventsCache[mainActionKey];

    for (const event in events) {
        context.addOnEventRules(event, events[event]);
    }
}

export function applyWhensToContext(mainActionKey: string, context: any) {
    if (typeof whenEventsCache[mainActionKey] != 'object') {
        // console.error(`applyWhensToContext->Error : ${mainActionKey} dones't exist in the when events cache`);
        return;
    }

    if (typeof context.addRule != 'function') {
        return getLogger().critical(`Action Decorators->applyWhensToContext: "addRule" DID NOT EXIST ON THE GIVEN CONTEXT. COULDNT INITALIZE YOU "When" decorator actions`);
    }

    // loop over each entity hook cache "pre | post"
    for (const hook in whenEventsCache[mainActionKey]) {
        // now loop over each rule and add it to the instance
        for (const ruleKey in whenEventsCache[mainActionKey][hook]) {
            const roles = whenEventsCache[mainActionKey][hook][ruleKey].roles;
            const condition = whenEventsCache[mainActionKey][hook][ruleKey].condition;
            const result = whenEventsCache[mainActionKey][hook][ruleKey].result;

            context.addRule(
                hook,
                ruleKey,
                function (res: any) {
                    // this is where we apply the role check to the condition of the whens
                    if (roles && roles.length > 0) {
                        if (!this.request.auth.hasRole(roles)) return false;
                    }

                    return condition(res);
                }.bind(context),
                result.bind(context),
            );
        }
    }
}

export function EAction (decArgs: EActionI = {}) {
    let repoKey: string, bits: string[];

    const hasRepo = !!decArgs?.targetRepo;

    const datasources: any = {}, repos: any = {};

    try {
        if (hasRepo) {
            bits = decArgs.targetRepo.split('.');
            repoKey = kebabCase(bits[1]);
        }

        if (Array.isArray(decArgs?.datasources)) {
            for (const ds of decArgs.datasources) {
                datasources[ds] = new (PDC.getCachedDs(ds))();
            }
        }

        if (Array.isArray(decArgs?.repos)) {
            for (const repo of decArgs.repos) {
                const repoKey = PDC.convertStringToRepoKey(repo);
                repos[repoKey] = PDC.getRepo(repoKey);
            }
        }
    }
    catch (e) {
        console.log('EAction Decorator: Set Bits: ', e);

        throw new InternalServerErrorResponse();
    }

    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        let repo: any, props: any, serviceProps: any;

        if (hasRepo) {
            repo = PDC.getRepo(decArgs.targetRepo, 'EAction: cache repo');
        }

        try {
            props = PDC.getCachedActionInputProps(constructor.name + 'Input');
        }
        catch (e) {
            console.error(e);
            console.log('Error caching props for action input: ', constructor.name);
        }

        if (hasRepo) {
            constructor.prototype.targetEntity = repoKey;
        }

        // const modelPtString = Object.getPrototypeOf(repo.model.prototype).mainClassName;

        constructor.prototype.logger = getLogger();
        constructor.prototype.mainClassName = constructor.name;
        constructor.prototype.model = hasRepo ? repo.model : undefined;
        constructor.prototype.repo = hasRepo ? repo : undefined;

        let actionInput = props ? new (require(props.path).default) : undefined, actionChain: any;

        if (typeof actionChainCache[constructor.name] != 'undefined') {
            actionChain = actionChainCache[constructor.name];
        }
        else actionChain = [];

        Object.defineProperty(constructor, 'metadata', {
            value: decArgs,
            writable: false
        });

        return class ExtendedAction extends constructor {
            constructor(...args: any[]) {
                super(args);

                if (typeof decArgs?.condition === 'function') {
                    Object.defineProperty(this, 'condition', {
                        value: decArgs?.condition,
                        writable: false
                    });
                }

                if (typeof decArgs?.exceptions === 'object' && Array.isArray(decArgs?.exceptions)) {
                    Object.defineProperty(this, 'exceptions', {
                        value: decArgs?.exceptions,
                        writable: false
                    });
                }

                Object.defineProperty(this, 'roles', {
                    value: decArgs?.roles ?? [],
                    writable: false
                });
            }
            datasources = datasources;
            repos = repos;
            mainClassName = constructor.name;
            actionInput = actionInput;
            actionChain = actionChain;
        };
    }
}

/**
 * @param args
 * @returns
 */
// fuction is taking in the payload from the service
export function PreExec (args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.preCb = async function (adm: ActionDataManager) {
            try {
                if (args?.roles && args?.roles.length > 0) {
                    if (!adm.request.auth.hasRole(args?.roles)) return false;
                }

                adm.setAction('PreExec: ' + adm.totalActions);
                return await descriptor.value.apply(this, [adm]);
            }
            catch (e) {
                console.log('PreExec:preCb: ', e);
                throw e;
            }
        }
    };
}

/**
 *
 * @param args
 * @returns
 */
export function PostExec (args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.postCb = async function (adm: ActionDataManager) {
            try {
                if (args?.roles && args?.roles.length > 0) {
                    if (!adm.request.auth.hasRole(args?.roles)) return false;
                }

                adm.setAction('PostExec: ' + adm.totalActions);
                return await descriptor.value.apply(this, [adm]);
            }
            catch (e) {
                console.log('PostExec:postCb: ', e);
                throw e;
            }
        }
    };
}

/**
 *
 * @param args
 * @returns
 */
export function Success (args: SuccessArgsI = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        if (target.methodOverrides == undefined) {
            target.methodOverrides = {};
        }

        if (!args || Object.keys(args).length == 0) {
            target.methodOverrides[propertyKey] = original;
            return target.successCb = original;
        }

        if (args.message) {
            target.methodOverrides[propertyKey] = async function (adm: ActionDataManager, lc?: LogicChain) {
                if (adm.previousStepSuccessful) return await original.apply(this, [
                    new SuccessResponses(args.message)
                ]);
            };

            return target.successCb = async function (adm: ActionDataManager, lc?: LogicChain) {
                if (adm.previousStepSuccessful) return await original.apply(this, [
                    new SuccessResponses(args.message)
                ]);
            }
        }

        target.methodOverrides[propertyKey] = original;
        target.successCb = original;

        return target.successCb;
    };
}

/**
 * @param args
 * @returns
 */
export function Error () {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        if (target.methodOverrides == undefined) {
            target.methodOverrides = {};
        }

        target.errorCb = async function (error: string, adm: ActionDataManager) {
            adm.setError(error);

            return await original.apply(this, [
                adm,
                new LogicChain(adm, this.logger),
            ]);
        };

        target.methodOverrides[propertyKey] = original;
        target.errorCb = original;

        return target.errorCb;
    };
}

/**
 * @param args
 * @returns
 */
export function When (args: WhenI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let result, original = function (adm: ActionDataManager) {
            adm.setAction('When: ' + adm.totalActions);
            descriptor.value(adm);
        };

        if (args.onPassThrow) {
            // this will baiscally override the original call back and just throw an
            // error message instead which will get processed by the business rules engine
            result = async function() {throw args.onPassThrow}
        }
        else {
            result = async function(adm: ActionDataManager) {
                adm.setAction('When->Else');

                const res = await original.apply(this, [ adm, new LogicChain(adm, this.logger) ]);

                adm.result = res;
            }
        }

        addEventsToWhenQue(
            target.constructor.name,
            args.hook,
            propertyKey,
            args.condition,
            result,
            args?.roles
        );
    };
}

/**
 * @param args
 * @returns
 */
export function Run (args: any = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        target.execCb = async function (adm: ActionDataManager, lc?: LogicChain) {
            // try {
                adm.setAction('Run: ' + adm.totalActions);
                await original.apply(this, [adm, lc]);
                adm.previousStepSuccessful = true;
            // }
            // catch (e) {
            //     this.logger.warnI(`ActionDecorators.Run.Error: ${e.message || e}`);
            //     adm.previousStepSuccessful = false;
            // }
        };
    };
}

/**
 * @param args
 * @returns
 */
 export function RepoMethod (params: any = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = typeof params == 'string' ? params : params?.method;

        const cb = async function(adm: ActionDataManager, lc?: LogicChain) {
            try {
                adm.setAction('RepoMethod: ' + adm.totalActions);

                let ai;

                if (adm?.input) ai = typeof adm?.input == 'function' ? await adm?.input(adm, lc) : adm?.input;

                const res = this.repo[method](adm, lc);

                adm.previousStepSuccessful = true;
                adm.setResultInternal(res, 'RepoMethod');
                adm.setSuccess(`Successfully ran repo method "${method}"`);
            }
            catch (e) {
                const em = `ActionDecorators.RepoMethod.Error: ${e.message || e}`;
                this.logger.warnI(em);
                adm.previousStepSuccessful = false;
                adm.setError(em);
            }
        }

        addActionToQueue(target, cb, 'RepoMethod', params);
    };
}