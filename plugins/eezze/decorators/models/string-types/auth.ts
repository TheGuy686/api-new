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

const bcrypt = require('bcrypt');

interface AuthSaltI extends BaseArgsI {
    saltRounds?: number;
}

interface AuthVerifierI extends BaseArgsI {
    saltColumn: string;
    passwordColumn: string;
}

export function Salt(args: AuthSaltI = {}) {
    return function (target: any, propertyKey: string) {
        if (typeof args?.saltRounds != 'number') {
            args.saltRounds = 10;
        }

        // args.isSecret = true;

        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            // if the salt doesn't already exist on the entity then it should 
            // just get set by default to the salt value from the lib 
            return this[backingField] ?? bcrypt.genSaltSync(args.saltRounds);
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;
            // console.warn(`A salt field can not be manually set. Changes were mitigated`);
            // return;

            this[backingField] = newVal;
        };

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        // i guess there is always a need to have to capability of custom validation
        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid salt`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            // do we even need to have a validator here as this should always be set or set by
            // our framework. There might be cases that I'm not aware of. Lets look at this later
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                // if (!isDate(this[backingField], args)) {
                //     addFailMessage(adm, propertyKey, `${this[backingField]} is not a valid date format`);
                // }

                removeUndefined(target, adm, propertyKey, args);
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'date', false,  args.isTransient, args.default);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}

export function Verifier(args: AuthVerifierI) {
    return function (target: any, propertyKey: string) {
        // args.isSecret = true;

        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            // in the case it's a regular Query, there's no value for the password provided, return empty string.
            if (this[args.passwordColumn] !== undefined) {
                // same as the salt. If the password exists (which should be transient) and then
                // we just consume that value and input it into the hash to get the hash value.
                return this[backingField] ?? bcrypt.hashSync(
                    this[args.passwordColumn],
                    this[args.saltColumn],
                );
            }

            return '';
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;
            // console.warn(`A verifier field can not be manually set. Changes were mitigated`);
            // return;

            this[backingField] = newVal;
        };

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        // i guess there is always a need to have to capability of custom validation
        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid salt`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            // do we even need to have a validator here as this should always be set or set by
            // our framework. There might be cases that I'm not aware of. Lets look at this later
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                // if (!isDate(this[backingField], args)) {
                //     addFailMessage(adm, propertyKey, `${this[backingField]} is not a valid date format`);
                // }

                removeUndefined(target, adm, propertyKey, args);
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'date', false,  args.isTransient, args.default);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}