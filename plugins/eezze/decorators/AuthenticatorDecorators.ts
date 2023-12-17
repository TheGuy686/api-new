import { getLogger } from '..';
import { ActionDataManager, LogicChain, EezzeJwtToken } from '../classes';

export interface E_AUTH_ITEM {
    condition?: E_CM_CB_BOOL;
    src: E_CM_CB_STR | string;
}

interface AuthArgsI {
    type: E_AUTH_TYPE;
    additionalHeaders?: E_CM_CB_OBJ | { [key: string]: string },
	secret: string,
	sources: E_AUTH_ITEM[];
	user?: E_CM_CB_OBJ;
	roles?: E_CM_CB_STR_ARR;
    debug?: boolean;
}

export function EAuthenticator(params: AuthArgsI) {
    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        constructor.prototype.getUser = params.user;

        Object.defineProperty(constructor, 'props', {
            value: params,
            writable: false,
            configurable: false,
        });

        return class ExtendedAuthenticator extends constructor {
            logger = getLogger();

            async validate(adm: ActionDataManager) {
                if (adm.request.auth.isAuthenticated) return true;

                adm.setAction(`EAuthenticator->"${params.type}"`, undefined, true);

                const self: any = this;

                let token: string | boolean;

                // first loop through each of the sources and see if we can get a valid source
                for (const src of params.sources) {
                    token = await self.getTokenFromSycForType(adm, params.type, src);

                    // if the token is a string then there is no need to check the other sources
                    if (typeof token == 'string') {
                        adm.request.auth.setToken(token);
                        break;
                    }
                }

                // if the token isn't found the it'll be a bool so not valid source
                if (typeof token !== 'string') return false;

                switch (params.type) {
                    case 'jwt': {
                        let ad: any;

                        if (typeof params?.additionalHeaders == 'function') {
                            ad = await params?.additionalHeaders(adm, new LogicChain(adm, adm.logger));
                        }
                        else if (typeof params?.additionalHeaders == 'object') {
                            ad = params.additionalHeaders;
                        }

                        const res = EezzeJwtToken.verify(
                            token,
                            null,
                            ad,
                            params?.secret,
                            !!params?.debug,
                        );

                        if (params?.debug) {
                            adm.logger.warn(`After EezzeJwtToken.verify->RES: ${JSON.stringify(res, null, 4)}`);
                        }

                        if (!res.success) return false;

                        adm.request.auth.setDecodedTokenData(res.decoded);
                        adm.setResultInternal(res.decoded, 'EAuthenticator->validate');

                        adm.request.auth.setGetUserCb(params.user);

                        return true;
                    }
                }
            }

            async serialize(adm: ActionDataManager, src: string) {
                const self: any = this, out: any = {};

                if (!src) throw new Error(`There was no src supplied for authentication serialize`);

                try {
                    if (typeof params?.user == 'function') {
                        adm.request.auth.setUser(await params.user(adm, new LogicChain(adm, adm.logger)));
                    }
                    else {
                        adm.request.auth.setUser(adm.request.auth.decoded);
                    }

                    if (typeof params?.roles != 'undefined') {
                        let rls: string[] = [];

                        if (typeof params.roles == 'function') {
                            rls = await params.roles(adm, new LogicChain(adm, adm.logger));

                            if (!Array.isArray(rls)) {
                                throw new Error(`Couldn't set roles as a string array was expected, got type "${typeof rls}"`);
                            }
                        }
                        else rls = params.roles;

                        adm.request.auth.setRoles(rls);
                    }

                    adm.currentAction.setResult({}, 'EAuthenticator->serialize');
                }
                catch (e) {
                    console.log('EAuthenticator decorator: ', e);

                    const message = `Error serializing model: ${constructor.name}: ${e.message}`;
                    console.log(message);
                    self.logger.error(message, 'EAuthenticator: serialize: catch', adm);
                }
            }
        };
    }
}