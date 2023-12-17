import { ActionDataManager } from '../../../classes';
import EezzeJwtToken, { ExpiresInI } from '../../../classes/EezzeJwtToken';
import {
    initClassKeyRefs,
    BaseArgsI,
    checkAndSetTargetDefaults,
    addFailMessage,
    setDefaultTargetFromArgs,
    addRequiredValidationError,
} from '../types';

import PDC from '../../../classes/ProjectDependancyCaches';

interface JwtTokenArgsI extends BaseArgsI {
    refreshOnValidate?: boolean;
    expiresIn?: ExpiresInI;
    refreshTokenExpiresIn?: ExpiresInI;
    additionalHeaders?: {[prop: string]: string};
    secret?: string;
}

interface JWTTokenDecodedI extends BaseArgsI {
    serializePropsToOutput?: boolean;
}

export function JWTToken(args: JwtTokenArgsI = { isTransient: false }) {
    if (typeof args.secret == 'undefined') {
        args.secret = 'this-is-a-long-string-that-should-be-replaced';
    }

    return function (target: any, propertyKey: string) {
        const backingField = '_' + propertyKey;
        let decodedValue: string;

        const getter = function () { return this[backingField] };

        const setter = function (newVal: string) {
            if (args?.required && !newVal) {
                throw new Error(`Decorators->models->jwt-types->JWT Token (String): Required value "${propertyKey}" was not valid`);
            }

            if (typeof newVal == 'undefined' || newVal == null) newVal = '';

            if (typeof newVal == 'object') {
                this[backingField] = JSON.stringify(newVal);
            }
            else this[backingField] = `${newVal}`;
        };

        Object.defineProperty(target, propertyKey, { get: getter, set: setter, configurable: true });

        Object.defineProperty(target, `${propertyKey}Decoded`, {
            get () { return decodedValue },
            set (newVal: any) { decodedValue = newVal },
        });

        checkAndSetTargetDefaults(target);
        setDefaultTargetFromArgs(args, target, propertyKey);

        // here we store the validation call backs so that when we call the validate
        // method we can loop through each callback and run the individual checks
        target.propValidationCbs[propertyKey] = function (adm: ActionDataManager) {
            addRequiredValidationError(target, adm, propertyKey, args);

            const res = EezzeJwtToken.verify(
                target[propertyKey],
                args?.message,
                args?.additionalHeaders,
                args?.secret,
                !!args?.debug,
            );

            if (args?.debug) {
                console.log('After EezzeJwtToken.verify->RES: ', res);
            }

            if (!res.success) {
                addFailMessage(adm, propertyKey, res.error);
                return false;
            }

            if (args?.refreshOnValidate) {
                const decoded: any = {...res.decoded.payload};

                const loginTokens = EezzeJwtToken.resign(
                    decoded,
                    args.expiresIn,
                    args.refreshTokenExpiresIn,
                    args?.additionalHeaders,
                    args?.secret,
                    !!args?.debug,
                );

                target[`${propertyKey}Decoded`] = {
                    idToken: loginTokens.idToken,
                    refreshToken: loginTokens.refreshToken,
                    decoded: res.decoded,
                };

                if (args?.debug) {
                    console.log('After refreshOnValidate.verify->RES: ', target[`${propertyKey}Decoded`]);
                }
            }
            else {
                target[`${propertyKey}Decoded`] = res.decoded?.payload;
            }
        };

        if (!PDC.entityPropExists(target.constructor.name, propertyKey)) {
            PDC.registerEntityProps(target.constructor.name, propertyKey, 'jwt-token', false, false);
        }

        initClassKeyRefs(target, propertyKey, 'string');
        initClassKeyRefs(target, `${propertyKey}Decoded`, 'any');
    }
}

export function JWTTokenDecoded(args: JWTTokenDecodedI) {
    return function (target: any, propertyKey: string) {
        initClassKeyRefs(target, propertyKey, 'string');
        checkAndSetTargetDefaults(target);

        if (args?.isWhereKey) target._getOneKeys.push(propertyKey);

        setDefaultTargetFromArgs(args, target, propertyKey);
    }
}