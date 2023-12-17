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
import isDate from 'validator/lib/isDate';
import PDC from '../../../classes/ProjectDependancyCaches';

/**
 * delimiters - default; ['/', '-']
 *
 * format - default; YYYY/MM/DD
 *
 * strictMode (reject input different from format) - default: false
 */
 interface IDate extends BaseArgsI {
    delimiters?: string[];
    format?: string;
    strictMode?: boolean;
    default?: any;
}

export function EDate(args: IDate = { delimiters: ['/', '-'], format: 'YYYY/MM/DD', strictMode: false, isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            this[backingField] = newVal
        };

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid date format`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!isDate(this[backingField], args)) {
                    addFailMessage(adm, propertyKey, `${this[backingField]} is not a valid date format`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'date', false,  args.isTransient, args.default);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}