import { ActionDataManager, LogicChain } from '../../../classes';
import {
    initClassKeyRefs,
    BaseObjArgsI,
    checkAndSetTargetDefaults,
    setDefaultTargetFromArgs,
    addRequiredValidationError,
    processSetterArgs,
    removeUndefined,
    addFailMessage
} from '../types';

import PDC from '../../../classes/ProjectDependancyCaches';

export function Obj(args: BaseObjArgsI = { isTransient: false}) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: any) {
            if (this[backingField] === newVal || typeof newVal === 'undefined') return;
            this[backingField] = newVal;

            processSetterArgs(args, target, this[backingField]);
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            configurable: true
        });

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'object');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (!PDC.entityPropExists(target?.constructor?.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'object', false,  args.isTransient, args.default);
        }

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid object`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                const val = target[backingField];

                if (typeof val != 'object') {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid object`);
                }
                else if (typeof val == 'object') {
                    const keys = Object.keys(val);

                    if (!args?.canBeEmpty && keys.length == 0) {
                        addFailMessage(adm, propertyKey, `Object can not be empty`);
                    }
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
    }
}