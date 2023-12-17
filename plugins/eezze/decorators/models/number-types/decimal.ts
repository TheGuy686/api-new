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
import isDecimal from 'validator/lib/isDecimal';
import { FloatLocale } from 'validator/lib/isFloat';
import PDC from '../../../classes/ProjectDependancyCaches';

/**
 * force_decimal - force to decimal format
 *
 * decimal_digits - given as a range like '1,3', a specific value like '3' or min like '1,'.
 *
 * locale - determine decimal separator by locale
 */
 interface IDecimal extends BaseArgsI {
    required: boolean;
    forceDecimal?: boolean;
    decimalDigits?: string;
    locale?: FloatLocale;
    default?: number;
}

export function Decimal(args: IDecimal = {
    required: false,
    forceDecimal: false,
    decimalDigits: '1,',
    isTransient: false,
    locale: 'en-US'
}) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined' || !newVal) return;

            if (args?.required && (!newVal || typeof newVal == 'object')) {
                throw new Error(`Decorators->models->number-types->Decimal: Required value "${propertyKey}" was not valid`);
            }

            this[backingField] = parseFloat(newVal);
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'number');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'decimal', false, args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, this.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid decimal`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!this[backingField] || !isDecimal(this[backingField], {
                    force_decimal: args.forceDecimal,
                    decimal_digits: args.decimalDigits,
                    locale: args.locale,
                })) {
                    addFailMessage(adm, propertyKey, `${this[backingField]} is not a Decimal`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
    }
}