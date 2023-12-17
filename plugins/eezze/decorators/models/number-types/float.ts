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
import isFloat, { FloatLocale } from 'validator/lib/isFloat';
import PDC from '../../../classes/ProjectDependancyCaches';

/**
 * min - greater or equal
 *
 * max - less or equal
 */
 interface IFloat extends BaseArgsI {
    required: boolean;
    min?: number;
    max?: number;
    locale?: FloatLocale;
    default?: number;
}

export function Float(args: IFloat = { required: false,  isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined' || !newVal) return;

            if (args?.required && (!newVal || typeof newVal == 'object')) {
                throw new Error(`Decorators->models->number-types->Float: Required value "${propertyKey}" was not valid`);
            }

            this[backingField] = parseFloat(newVal);
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'number');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'float', false,  args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, this.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid float`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!this[backingField] || !isFloat(this[backingField], args)) {
                    addFailMessage(adm, propertyKey, `${this[backingField]} is not a float`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
    }
}