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
import { ActionDataManager, LogicChain } from '../../../classes';

/**

 */
interface IOneToOne extends BaseArgsI {
    joinOn?: string[];
    model: string;
    column?: string;
    foreignKey?: string;
    direction?: string;
}

interface IManyToOne extends BaseArgsI {
    joinOn?: string[];
    model: string;
    column?: string;
    foreignKey?: string;
    direction?: string;
}

interface IOneToMany extends BaseArgsI {
    joinOn?: string[];
    model: string;
    column?: string;
    foreignKey?: string;
    direction?: string;
}

interface IManyToMany extends BaseArgsI {
    joinOn?: string[];
    model: string;
    column?: string;
    foreignKey?: string;
    owner: string;
    direction?: string;
}

export function OneToOne(args: IOneToOne) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField]};

        const setter = function (newVal: string) {
            this[backingField] = newVal;
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'relation');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, this.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid relation`);
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

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, args.model, true, false, undefined, {
                code: 'OTO',
                name: 'ONE TO ONE',
            });
        }

        if (!PDC.relationExists(target.constructor.name, propertyKey)) {
            PDC.registerRelation(target.constructor.name, propertyKey, args.model, 'OneToOne', args.joinOn, args.column, args.foreignKey, undefined, args?.direction)
        }
    }
}

export function ManyToOne(args: IManyToOne) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField]};

        const setter = function (newVal: string) {
            this[backingField] = newVal;
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'relation');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, this.logger))) {
                    addFailMessage(adm, propertyKey, args?.message ?? `${target[backingField]} is not a valid relation`);
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

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, args.model, true, false, undefined, {
                code: 'MTO',
                name: 'MANY TO ONE',
            });
        }

        if (!PDC.relationExists(target.constructor.name, propertyKey)) {
            PDC.registerRelation(target.constructor.name, propertyKey, args.model, 'ManyToOne', args.joinOn, args.column, args.foreignKey, undefined, args?.direction)
        }
    }
}

export function OneToMany(args: IOneToMany) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField]};

        const setter = function (newVal: string) {
            this[backingField] = newVal;
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'relation');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
            addRequiredValidationError(target, adm, propertyKey, args);
            removeUndefined(target, adm, propertyKey, args);
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, args.model, true, false, undefined, {
                code: 'OTM',
                name: 'ONE TO MANY',
            });
        }

        if (!PDC.relationExists(target.constructor.name, propertyKey)) {
            PDC.registerRelation(target.constructor.name, propertyKey, args.model, 'OneToMany', args.joinOn, args.column, args.foreignKey, undefined, args?.direction)
        }
    }
}

export function ManyToMany(args: IManyToMany) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField]};

        const setter = function (newVal: string) {
            this[backingField] = newVal;
        };

        checkAndSetTargetDefaults(target);

        initClassKeyRefs(target, propertyKey, 'relation');
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
            addRequiredValidationError(target, adm, propertyKey, args);
            removeUndefined(target, adm, propertyKey, args);
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, args.model, true, false, undefined, {
                code: 'MTM',
                name: 'MANY TO MANY',
            });
        }

        if (!PDC.relationExists(target.constructor.name, propertyKey)) {
            PDC.registerRelation(target.constructor.name, propertyKey, args.model, 'ManyToMany', args.joinOn, args.column, args.foreignKey, args.owner, args?.direction)
        }
    }
}