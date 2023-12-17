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

import isInt from 'validator/lib/isInt';
import { FloatLocale } from 'validator/lib/isFloat';
import PDC from '../../../classes/ProjectDependancyCaches';
import { Allow } from 'class-validator';
import { arg } from 'mathjs';

/**
 * min - greater or equal
 * max - less or equal
 * allow_leading_zeroes - default: false
 * allow_undefined - default: false
 */
interface IInt extends BaseArgsI {
    required?: boolean;
    min?: number;
    max?: number;
    allowLeadingZeroes?: boolean;
    allowUndefined?: boolean;
    locale?: FloatLocale;
    default?: number;
}

export function Int(args: IInt = { required: false, allowLeadingZeroes: false, allowUndefined: false, isTransient: false, }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField];
        }

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined' || !newVal) return;

            if (args?.required && (!newVal || typeof newVal == 'object')) {
                throw new Error(`Decorators->models->number-types->Int: Required value "${propertyKey}" was not valid`);
            }

            this[backingField] = parseInt(newVal);
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'number');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'int', false,  args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, this.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid integer`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (args.allowUndefined && typeof target[backingField] == 'undefined') {
                    // we do nothing, this is an allowed state, remove the undefined.
                }
                else if (!target[propertyKey]
                    || !isInt(target[propertyKey] + '', { allow_leading_zeroes: args.allowLeadingZeroes })
                ) {
                    addFailMessage(adm, propertyKey, `${target[propertyKey]} is not an integer`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
    }
}