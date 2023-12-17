import { ActionDataManager, LogicChain } from '../../../classes';
import {
    initClassKeyRefs,
    BaseArgsI,
    checkAndSetTargetDefaults,
    addFailMessage,
    processSetterArgs,
    setDefaultTargetFromArgs,
    addRequiredValidationError,
    removeUndefined
} from '../types';

import PDC from '../../../classes/ProjectDependancyCaches';

export function UID(args: BaseArgsI = { isTransient: false }) {
    return function (target: any, propertyKey: string) {
        if (target._getOneKeys == undefined) {
            target._getOneKeys = [];
        }

        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: any) {
            if (this[backingField] == newVal || typeof newVal === 'undefined') return;
            this[backingField] = newVal;

            processSetterArgs(args, this, this[backingField]);
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        checkAndSetTargetDefaults(target);

        target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'number');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'uid', false, args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid uid`);
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