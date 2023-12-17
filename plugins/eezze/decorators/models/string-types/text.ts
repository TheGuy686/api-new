import { ActionDataManager, LogicChain } from '../../../classes';
import {
    initClassKeyRefs,
    BaseArgsI,
    checkAndSetTargetDefaults,
    addFailMessage,
    setDefaultTargetFromArgs,
    addRequiredValidationError,
    removeUndefined
} from '../types';

import PDC from '../../../classes/ProjectDependancyCaches';

export function Text(args: BaseArgsI = { isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            if (args?.required && !newVal) {
                throw new Error(`Decorators->models->text-types->Text: Required value "${propertyKey}" was not valid`);
            }

            if (typeof newVal == 'undefined' || newVal == null) newVal = '';

            if (typeof newVal == 'object') {
                this[backingField] = JSON.stringify(newVal);
            }
            else this[backingField] = `${newVal}`;
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'text', false, args.isTransient, args.default);
        }


        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid text`);
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

export function LongText(args: BaseArgsI = { isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField] };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            this[backingField] = newVal
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'long-text', false, args.isTransient);
        }

        target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
            addRequiredValidationError(target, adm, propertyKey, args);
            removeUndefined(target, adm, propertyKey, args);
        }
    }
}