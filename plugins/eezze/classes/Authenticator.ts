import { generateRandomString } from '../libs/StringMethods';
import { arraySames } from '../libs/ArrayMethods';
import ActionDataManager from './ActionDataManager';
import LogicChain from './logic/LogicChain';

export interface AuthUserI {[key: string]: any;}

export default class Authenticator {
    public __id: string;
    private _decoded: any;
    private _idToken: string;
    private _user: AuthUserI;
    private roles: string[];
    private _isAuthenticated: boolean = false;
    private _getUserCb: E_CM_CB_OBJ;

    public get idToken() {return this._idToken}
    public get user() {return this._user}
    public get isAuthenticated() {return this._isAuthenticated}
    public get decoded() {return this._decoded}

    constructor() {
        this.__id = generateRandomString(5);
        this._idToken = '';
        this._user = {};
        this.roles = [];
    }

    private addRole(role: string) {
        if (this.roles.includes(role)) return;
        this.roles.push(role);
    }

    public setGetUserCb(cb: E_CM_CB_OBJ) { this._getUserCb = cb }

    async getUser(result: any, adm: ActionDataManager, lc?: LogicChain) {
        let out: any = {};

        if (typeof this._getUserCb == 'function') {
            const origRes = adm.result;

            // here we need to spoof the origional jwt token decoded data as the JWT will always
            // return an object with the decoded payload when successful. So we need to spoof the
            // payload object with the current result of the calling function / adm.result
            adm.setResultInternal({ payload: result }, 'Authenticator->getUser 1');

            out = await this._getUserCb(adm, new LogicChain(adm, adm.logger));

            adm.setResultInternal(origRes, 'Authenticator->getUser 2');
        }
        else if (typeof this._getUserCb == 'object') {
            out = this._getUserCb;
        }
        else out = adm.request.auth.user;

        return out;
    }

    setDecodedTokenData(decoded: any) { this._decoded = decoded }

    setRoles(roles: string[] = []) {
        if (this.roles.length > 0) return;

        let rls: any = roles;

        if (typeof rls == 'string') {
            try {
                rls = JSON.parse(rls);
            }
            catch(e) {
                const err = `Couldn't parse the user roles. Given roles: ${rls}`;
                console.log(err, e.message);
                throw err;
            }
        }

        rls.forEach((role: string) => this.addRole(role));
    }

    hasRole(roles: string[] = []): boolean {
        return arraySames(roles, this.roles).length > 0;
    }

    setUser(user: AuthUserI) {
        if (this.isAuthenticated) return;

        if (Object.keys(this?._user ?? {}).length > 0) {
            console.log('Currently set user: ', this.user);
            throw new Error(`The auth user can only be set once`);
        }

        this._user = user;

        this._isAuthenticated = true;

        Object.freeze(this.isAuthenticated);
    }

    setToken(idToken: string) {
        this._idToken = idToken;
    }
}