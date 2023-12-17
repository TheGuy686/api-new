import BaseModel from '../../base/models/BaseModel';

import { getLogger } from '../..';
import { isPromise } from '../../libs/ObjectMethods';
import { ActionDataManager, LogicChain } from '../../classes';
import { RequestErrorMessagesI } from '../../interfaces';

export interface BaseArgsI {
    debug?: boolean,
    roles?: string[];
    required?: boolean;
    bindProps?: string[];
    set?: (context: any, value: any) => any,
    input?: any,
    validate?: (value: any, adm?: ActionDataManager, lc?: LogicChain) => boolean,
    message?: string;
    example?: string;
    serialize?: (value: any, adm?: ActionDataManager, lc?: LogicChain) => any,
    serializeProperty?: boolean;
    isWhereKey?: boolean;
    isSecret?: boolean;
    default?: any;
    isTransient?: boolean;
    delimiter?: string;
}

export interface BaseObjArgsI extends BaseArgsI {
    canBeEmpty?: boolean;
}

interface EPropArgsI extends BaseArgsI {type: string}

export function initClassKeyRefs(target: any, propertyKey: string, type: string) {
    if (typeof BaseModel.classKeys[target.constructor.name] == 'undefined') {
        const classStr = target.constructor.toString();

        const parentClass = classStr.match(/extends.*?([a-zA-Z0-1_]+)[ ]+\{/);

        const def: any = { properties: {} };

        if (parentClass) def.parentClass = parentClass[1];

        BaseModel.classKeys[target.constructor.name] = def;
    }

    BaseModel.classKeys[target.constructor.name].properties[propertyKey] = type;
}

export function checkAndSetTargetDefaults(target: any) {
    if (!target.logger && getLogger)    target.logger = getLogger();
    if (!target.propValidationCbs)      target.propValidationCbs = {};
    if (!target.propMapperCbs)          target.propMapperCbs = {};
    if (!target.validationErrors)       target.validationErrors = {} as RequestErrorMessagesI;
    if (!target._serializeKeyOverrides) target._serializeKeyOverrides = [];
    if (!target._getOneKeys)            target._getOneKeys = [];
    if (!target._propertyDecoratorArgs) target._propertyDecoratorArgs = {};
    if (!target._propTypes)             target._propTypes = {};
}

export function addFailMessage(adm: ActionDataManager, propertyKey: string, message: string, example?: string) {
    adm.request.validationErrors[propertyKey] = {
        key: propertyKey,
        message,
        example,
    };
}

export function addRequiredValidationError(target: any, adm: ActionDataManager, propertyKey: string, args: any) {
    if (!args?.required) return;

    if (typeof target[propertyKey] == 'undefined' ||
        target[propertyKey] === null ||
        target[propertyKey] === ''
    ) {
        addFailMessage(adm, propertyKey, `Required property not set "${propertyKey}"`);
    }
}

export function removeUndefined(target: any, adm: ActionDataManager, propertyKey: string, args: any) {
    if (typeof target[propertyKey] == 'undefined') {
        delete target[propertyKey];
        // delete target['propValidationCbs'][propertyKey];
        // delete target['propMapperCbs'][propertyKey];
        // delete target['_propertyDecoratorArgs'][propertyKey];
    }
}

/**
 * Sets the value to additional properties which are not explicitly defined in the original Model object
 *
 * @param args bindProps; additional properties that need to be bound to the defined property in the model object
 * @param target ExtendedModel class binding the model property values
 * @param value value to be bound to additional properties
 */
export function processSetterArgs(args: any, target: any, value: any) {
    if (args.bindProps && Array.isArray(args.bindProps)) {
        for (const k of args.bindProps) {
            target['_' + k] = value;
        }
    }
}

export function setDefaultTargetFromArgs(args: any, target: any, propertyKey: string) {
    target._propertyDecoratorArgs[propertyKey] = args;

    if (args.input) {
        target.propMapperCbs[propertyKey] = function (adm: ActionDataManager, src?: string) {
            target[propertyKey] = args.input(adm, new LogicChain(adm, adm.logger), src);
        }.bind(target);
    }

    if (args.serialize) {
        if (isPromise(args.serialize)) {
            target._serializeKeyOverrides[propertyKey] = async function (trg: any, adm: ActionDataManager, src?: string) {
                return await args.serialize(trg[propertyKey], adm, src);
            };
        }
        else {
            target._serializeKeyOverrides[propertyKey] = function (trg: any, adm: ActionDataManager, src?: string) {
                // const modelKeys = BaseModel.getClassProperties(target.constructor.name);
                return args.serialize(trg[propertyKey], adm, src);
            };
        }
    }
}

export function EProp(args: EPropArgsI) {
    return function(target: any, propertyKey: string) {
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);
        initClassKeyRefs(target, propertyKey, args.type);
    }
}

export * from './string-types/index';
export * from './number-types/index';
export * from './bool-types/index';