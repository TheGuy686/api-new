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
import isEmail from 'validator/lib/isEmail';
import PDC from '../../../classes/ProjectDependancyCaches';

/**
 * allowDisplayName - true will also match; Display Name <email-address>
 *
 * requireDisplayName - requires; Display Name <email-address> ?
 *
 * allowUtf8LocalPart - allow non English UTF8 characters?
 *
 * requireTld - email address with TLD in their name?
 *
 * allowIpDomain - ip address allowed?
 *
 * domainSpecificValidation - e.g. disallowing certain syntactically valid email addresses that are rejected by GMail
 *
 * blacklistedChars - not allowed characters
 *
 * hostBlacklist - set to an array of strings and the part of the email after the @ symbol matches one of the strings defined in it, the validation fails.
 */
 interface IEmail extends BaseArgsI {
    required: boolean;
    allowDisplayName?: boolean;
    requireDisplayName?: boolean;
    allowUtf8LocalPart?: boolean;
    requireTld?: boolean;
    allowIpDomain?: boolean;
    domainSpecificValidation?: boolean;
    blacklistedChars?: string;
    hostBlacklist?: string[];
    default?: any;
}

// @Rolf: Just please make sure that all the params are camel case. We don't use
// underscore case anywhere else in the code base. cheers
export function Email(args: IEmail = {
    required: true,
    allowDisplayName: false,
    requireDisplayName: false,
    allowUtf8LocalPart: true,
    requireTld: true,
    allowIpDomain: false,
    domainSpecificValidation: false,
    blacklistedChars: '',
    isTransient: false,
    hostBlacklist: [],
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
                throw new Error(`Decorators->models->string-types->Email (String): Required value "${propertyKey}" was not valid`);
            }

            if (typeof newVal == 'undefined' || newVal == null) newVal = '';

            if (typeof newVal == 'object') {
                this[backingField] = JSON.stringify(newVal);
            }
            else this[backingField] = `${newVal}`;
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid email address`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                if (!isEmail(target[backingField] + '', {
                    allow_display_name: args?.allowDisplayName,
                    require_display_name: args?.requireDisplayName,
                    allow_utf8_local_part: args?.allowUtf8LocalPart,
                    require_tld: args?.requireTld,
                    allow_ip_domain: args?.allowIpDomain,
                    domain_specific_validation: args?.domainSpecificValidation,
                    blacklisted_chars: args?.blacklistedChars,
                    host_blacklist: args?.hostBlacklist,
                } as any)) {
                    addFailMessage(adm, propertyKey, `${target[backingField]} is not a valid email address`);
                }

                removeUndefined(target, adm, propertyKey, args);
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'email', false,  args.isTransient, args.default);
        }
    }
}

export function Emails(args: IEmail = {
    required: true,
    allowDisplayName: false,
    requireDisplayName: false,
    allowUtf8LocalPart: true,
    requireTld: true,
    allowIpDomain: false,
    domainSpecificValidation: false,
    blacklistedChars: '',
    hostBlacklist: [],
    isTransient: false
}) {
    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;

        const getter = function () { return this[backingField] };

        const setter = function (newVal: string[]) {this[backingField] = newVal;};

        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        if (typeof args?.validate == 'function') {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                removeUndefined(target, adm, propertyKey, args);

                // here we dont even bother to process the emails as the required and
                // empty checks will be done above if the required boolean is set.
                if (!Array.isArray(target[backingField])) return;

                target[backingField].forEach((email: string) => {
                    if (!args?.validate(target[backingField], adm, new LogicChain(adm, target.logger))) {
                        addFailMessage(adm, propertyKey, `${email} is not a valid email address`);
                    }
                });
            }
        }
        else {
            target.propValidationCbs[propertyKey] = async function (adm: ActionDataManager) {
                addRequiredValidationError(target, adm, propertyKey, args);

                // here we dont even bother to process the emails as the required and
                // empty checks will be done above if the required boolean is set.
                if (!Array.isArray(target[backingField])) return;

                target[backingField].forEach((email: string) => {
                    if (!isEmail(email + '', {
                        allow_display_name: args?.allowDisplayName,
                        require_display_name: args?.requireDisplayName,
                        allow_utf8_local_part: args?.allowUtf8LocalPart,
                        require_tld: args?.requireTld,
                        allow_ip_domain: args?.allowIpDomain,
                        domain_specific_validation: args?.domainSpecificValidation,
                        blacklisted_chars: args?.blacklistedChars,
                        host_blacklist: args?.hostBlacklist,
                    } as any)) {
                        addFailMessage(adm, propertyKey, `${email} is not a valid email address`);
                    }
                });
            }
        }

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'emails', false, args.isTransient);
        }

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });
    }
}