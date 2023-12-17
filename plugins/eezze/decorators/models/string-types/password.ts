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
import isStrongPassword from 'validator/lib/isStrongPassword';

import PDC from '../../../classes/ProjectDependancyCaches';

interface PasswordI extends BaseArgsI {
    minLength?: number;
    minLowercase?: number;
    minUppercase?: number;
    minNumbers?: number;
    minSymbols?: number;
    pointsPerUnique?: number;
    pointsPerRepeat?: number;
    pointsForContainingLower?: number;
    pointsForContainingUpper?: number;
    pointsForContainingNumber?: number;
    pointsForContainingSymbol?: number;
    returnScore?: boolean;
    default?: any;
}

interface PasswordConfirmI extends BaseArgsI {passwordProperty: string; isTransient: boolean;}

export function Password(args: PasswordI = {
    required: true,
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
    returnScore: false,
    isTransient: false
}) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            if (args?.required && !newVal) {
                throw new Error(`Decorators->models->password-types->Password (String): Required value "${propertyKey}" was not valid`);
            }

            if (typeof newVal == 'undefined' || newVal == null) newVal = '';

            if (typeof newVal == 'object') {
                this[backingField] = JSON.stringify(newVal);
            }
            else this[backingField] = `${newVal}`;
        };

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid password`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!isStrongPassword(target[backingField] + '', {
                    minLength: args.minLength,
                    minLowercase: args.minLowercase,
                    minUppercase: args.minUppercase,
                    minNumbers: args.minNumbers,
                    minSymbols: args.minSymbols,
                    pointsPerUnique: args.pointsPerUnique,
                    pointsPerRepeat: args.pointsPerRepeat,
                    pointsForContainingLower: args.pointsForContainingLower,
                    pointsForContainingUpper: args.pointsForContainingUpper,
                    pointsForContainingNumber: args.pointsForContainingNumber,
                    pointsForContainingSymbol: args.pointsForContainingSymbol,
                    returnScore: args?.returnScore ?? false,
                    isTransient: args?.isTransient
                } as any)) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid password`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'password', false,  args.isTransient, args.default);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}

export function PasswordConfirm(args: PasswordConfirmI = {
    required: true,
    passwordProperty: 'password',
    isTransient: false
}) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField] };

        const setter = function (newVal: string) {this[backingField] = newVal;};

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
            addRequiredValidationError(target, adm, propertyKey, args);

            if (typeof target[args.passwordProperty] == 'undefined') {
                addFailMessage(adm, propertyKey, `${args.passwordProperty} did not exist on target`);
                return;
            }

            if (target[args.passwordProperty] != target[backingField] + '') {
                addFailMessage(adm, propertyKey, `Password confirm did not match the password value`);
            }

            removeUndefined(target, adm, propertyKey, args);
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'password-confirm', false, args.isTransient);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}