import { ActionDataManager, LogicChain } from '../../../classes';
import {
    addFailMessage,
    addRequiredValidationError,
    checkAndSetTargetDefaults,
    initClassKeyRefs,
    setDefaultTargetFromArgs,
    removeUndefined
} from '../types';

import PDC from '../../../classes/ProjectDependancyCaches';

export function Boolean(args: any = {}) {
    return function(target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function() {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;

            this[backingField] = newVal
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        initClassKeyRefs(target, propertyKey, 'boolean');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'boolean', false, args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, this.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid boolean`);
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