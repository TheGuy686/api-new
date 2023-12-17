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

interface JsonI extends BaseArgsI {
    stringifyOnAccess?: boolean;
    default?: any;
}

export function Json(args: JsonI = { isTransient: false }) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () {
            if (typeof args.default !== 'undefined' && typeof this[backingField] === 'undefined') return args.default;

            return this[backingField]
        };

        const setter = function (newVal: string) {
            if (args.stringifyOnAccess) {
                try {
                    this[backingField] = JSON.stringify(JSON.parse(newVal));
                }
                catch (e) {
                    console.log(`Error stringifying: ${propertyKey}`);
                }
            }
            else {
                if (this[backingField] === newVal || typeof newVal === 'undefined') return;

                this[backingField] = newVal;
            }
        };

        if (!args.serialize) {
            /**
             * The target object will be of type BaseModel, and will not contain any values of Object under serialization.
             *
             * @param value value given by Type serialization function
             * @returns
             */
            args.serialize = function (value) {
                try {
                    if (typeof value == 'string') {
                        return JSON.stringify(JSON.parse(value));
                    }
                    return JSON.stringify(value);
                }
                catch (e) {
                    console.log(`There was an error serializing "${propertyKey}": `, e);
                    return value;
                }
            }
        }

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} Invalid value json value type. Expected "string | object"`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                try {
                    const val = target[backingField];

                    if (typeof val == 'object') {
                        JSON.parse(JSON.stringify(val));
                    }
                    else if (typeof val == 'string') {
                        JSON.parse(val);
                    }
                    else if (typeof val === 'undefined' && (args?.required === false || args?.required == undefined)) {
                        // do nothing, removeUndefined will remove this property from input object.
                    }
                    else {
                        if (!val && args.required) {
                            throw new Error(`Invalid value json value type. Expected "string | object". Got "${typeof val}"`);
                        }
                    }
                }
                catch (e) {
                    // console.log(e);
                    addFailMessage(adm, propertyKey, `${JSON.stringify(target[backingField])} is not a valid json format`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'json', false,  args.isTransient, args.default);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}