import { ActionDataManager, LogicChain } from '../../../classes';
import {
    initClassKeyRefs,
    BaseArgsI,
    checkAndSetTargetDefaults,
    setDefaultTargetFromArgs,
    addRequiredValidationError,
    processSetterArgs,
    removeUndefined,
    addFailMessage
} from '../types';

import PDC from '../../../classes/ProjectDependancyCaches';

export function String(args: BaseArgsI = { isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;
            return this[backingField];
        };

        const setter = function (newVal: any) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            if (args?.required && !newVal) {
                // throw `Decorators->models->string-types->String: Required value "${propertyKey}" was not valid`;
            }

            if (typeof newVal == 'undefined' || newVal == null) newVal = '';

            if (typeof newVal == 'object') {
                this[backingField] = JSON.stringify(newVal);
            }
            else this[backingField] = `${newVal}`;

            processSetterArgs(args, target, this[backingField]);
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (!PDC.entityPropExists(target?.constructor?.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'string', false, args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid string`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);
                removeUndefined(target, adm, propertyKey, args);
            }
        }
    }
}

export function StringArray(args: BaseArgsI = { isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            if (typeof this[backingField] == 'string') {
                return this[backingField].split(args?.delimiter ? args?.delimiter : ',');
            }

            return this[backingField];
        };

        const setter = function (newVal: any) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            if (args?.required && !newVal) {
                throw new Error(`Decorators->models->string-types->StringArray: Required value "${propertyKey}" was not valid`);
            }

            if (typeof newVal == 'undefined' || newVal == null) newVal = [];

            this[backingField] = newVal;

            processSetterArgs(args, target, this[backingField]);
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (!PDC.entityPropExists(target?.constructor?.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'string', false, args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid string array`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                try {
                    const arr = target?.[backingField].split(args?.delimiter ? args?.delimiter : ',');
                }
                catch (err) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid string array`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
    }
}