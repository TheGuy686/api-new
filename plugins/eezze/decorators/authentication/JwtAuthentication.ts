
import ActionDataManager from '../../classes/ActionDataManager';
import { addActionToQueue } from '../actions/ActionDecorators';
import ActionDecoratorArgs from '../../interfaces/ActionDecoratorArgs';
import EezzeJwtToken from '../../classes/EezzeJwtToken';
import LogicChain from '../../classes/logic/LogicChain';
import PDC from '../../classes/ProjectDependancyCaches';

const bcrypt = require('bcrypt');
const saltRounds = 10;

type LOGIN_CONDITION_ITEM = {
    run: E_CM_CB_BOOL | boolean;
    code?: number;
    message: string;
}
// type LOGION_CONDITION = LOGIN_CONDITION_ITEM | LOGIN_CONDITION_ITEM[];

interface LoginI extends ActionDecoratorArgs {
    type: string;
    authenticator: string;
    idTokenAlias?: string;
    refreshTokenAlias?: string;
    expiresIn?: object;
    secret?: string,
    input?: E_CM_CB_OBJ | object;
    data?: E_CM_CB_OBJ | object;
    password: E_CM_CB_STR | string;
    verifier: E_CM_CB_STR | string;
}

interface RegisterI extends ActionDecoratorArgs {
    password: E_CM_CB_STR | string;
}

interface ResetPasswordI extends ActionDecoratorArgs {
    password: E_CM_CB_STR | string;
}

function getTokens(args: LoginI, data: object, expiresIn: any = {minutes: 15}) {
    switch ((args?.type ?? '').toLowerCase()) {
        case 'jwt':
            const tokens = EezzeJwtToken.getLoginTokens(
                data,
                expiresIn,
                {days: 7},
                {},
                args?.secret
            );

            return {
                [args?.idTokenAlias ? args?.idTokenAlias : 'token']: tokens.idToken,
                [args?.refreshTokenAlias ? args?.refreshTokenAlias : 'refreshToken']: tokens.refreshToken,
            };
    }
}

export function Login(params: LoginI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function Login_OR(adm: ActionDataManager) {
            adm.setAction('Login_OR: ' + adm.totalActions);

            if (!params.password) {
                adm.setResultInternal(false, 'Login->if');
                adm.setError(params?.errorMessage ? params?.errorMessage : 'Password must be valid to login');
            }
            else if (!params.verifier) {
                adm.setResultInternal(false, 'Login->else if');
                adm.setError(params?.errorMessage ? params?.errorMessage : 'Please retrieve a user from the database before checking password');
            }
            else {
                try {
                    const auth = PDC.getAuthenticator(params.authenticator);

                    let password, verifier;

                    if (typeof params.password == 'function') {
                        password = await params.password(adm, new LogicChain(adm, this.logger));
                    }
                    else password = params.password;

                    if (typeof params.verifier == 'function') {
                        verifier = await params.verifier(adm, new LogicChain(adm, this.logger));
                    }
                    else verifier = params?.verifier ?? '0';

                    const res = bcrypt.compareSync(password, verifier ?? '0');

                    if (!res) {
                        adm.previousStepSuccessful = true
                        adm.setResultInternal({}, 'Login->else->if 2');
                        adm.setResponseCode(params?.errorCode ? params?.errorCode : 401);

                        const errMsg = params?.errorMessage ? params?.errorMessage :  'Incorrect user credentials';

                        adm.setError(errMsg);

                        adm.previousStepSuccessful = false;
                        adm.setResponseCode(401);
                        adm.setResultInternal({}, 'Login->Condition');

                        return;
                    }
                    else {
                        // const data = typeof params.data == 'object' ? params.success : await params.data(adm, new LogicChain(adm, this.logger));

                        // first default the result of the previous action. This is assuming the result
                        // of the previous action was a user from the database or from other sources
                        let input = adm.result;

                        if (typeof params?.input == 'function') {
                            input = await params.input(adm, new LogicChain(adm, this.logger));
                        }
                        else if (typeof params?.input == 'object') {
                            input = params.input;
                        }

                        // after we have the input from the arguments then we need to override to the user function from the
                        // authenticator if the function exists. if not then we will just leave the data set to what is defined
                        // from the authenticator "data" function if exists
                        if (auth.prototype?.getUser && typeof params.data != 'function') {
                            adm.request.auth.setGetUserCb(auth.prototype?.getUser);

                            input = await adm.request.auth.getUser(input, adm);
                        }
                        else if (typeof params?.data == 'function') {
                            input = await params.data(adm, new LogicChain(adm, this.logger));
                        }
                        else if (typeof params?.data == 'object') {
                            input =  params.data;
                        }

                        if (Array.isArray(params?.failOn)) {
                            adm.setResultInternal(input);

                            let c: any;

                            for (c of params.failOn) {
                                let cres: boolean = false;

                                if (typeof c.condition == 'function') {
                                    cres = await c.condition(adm, new LogicChain(adm, this.logger));
                                }
                                else cres = !!c.condition;

                                if (cres) {
                                    adm.previousStepSuccessful = false;
                                    adm.setError(c.message);
                                    adm.setResponseCode(c?.code ? c.code : 401);
                                    adm.setResultInternal({}, 'Login->Condition');

                                    return;
                                }
                            }
                        }

                        const tokens = getTokens(params, input, params?.expiresIn);

                        let res;

                        if (typeof params?.onSuccess == 'function') {
                            const lc = new LogicChain(adm, this.logger);
                            res = await params?.onSuccess(adm, lc, input);
                        }
                        else res = tokens;

                        adm.previousStepSuccessful = true;
                        adm.setResultInternal(res, 'Login->else->else 2');
                        adm.setResponseCode(params?.successCode ? params?.successCode : 200);
                        adm.setSuccess(params?.successMessage ? params?.successMessage : `Login successful`);

                        if (typeof params.onSuccess == 'function') {
                            await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                        }
                    }
                }
                catch (e) {
                    const em = `Login unsuccessful: "${e.message || e}"`;

                    this.logger.error(`Login unsuccessful: ${e.message}`, 'Decorators: Login: ctach', adm);

                    adm.previousStepSuccessful = false;
                    adm.setResponseCode(401);
                    adm.setError(em);

                    if (typeof params.onError == 'function') {
                        await params?.onError(adm, new LogicChain(adm, this.logger));
                    }

                    throw em;
                }
            }
        }

        addActionToQueue(target, cb, 'Login', params);
    }
}

export function Register(params: RegisterI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function Register_OR(adm: ActionDataManager) {
            try {
                adm.setAction('Register_OR: ' + adm.totalActions);

                if (!params.password) {
                    adm.setResultInternal(false, 'Register->if');
                    adm.setError(`Registration requires a valid password`);
                }
                else {
                    let password;

                    if (typeof params.password == 'function') {
                        password = await params.password(adm, new LogicChain(adm, this.logger));
                    }
                    else password = params.password;

                    const salt = bcrypt.genSaltSync(saltRounds);
                    const verifier = bcrypt.hashSync(password, salt);

                    adm.setResultInternal({
                        salt,
                        verifier,
                    }, 'Register->else');
                    adm.previousStepSuccessful = true;
                    adm.setSuccess(`Registration successful`);

                    if (typeof params.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }
                }
            }
            catch (e) {
                const em = `Registration unsuccessful: "${e.message || e}"`;

                this.logger.error(`Registration unsuccessful: ${e.message}`, 'Decorators: Registration: catch', adm);

                adm.previousStepSuccessful = false;
                adm.setError(em);

                if (typeof params.onError == 'function') {
                    await params?.onError(adm, new LogicChain(adm, this.logger));
                }

                throw em;
            }
        }

        addActionToQueue(target, cb, 'Register', params);
    }
}

export function ResetPassword(params: ResetPasswordI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function ResetPassword_OR(adm: ActionDataManager) {
            adm.setAction('ResetPassword_OR: ' + adm.totalActions);

            if (!params.password) {
                adm.setResultInternal(false, 'ResetPassword->if');
                adm.setError(`Reset password requires a valid password`);
            }
            else {
                try {
                    let password;

                    if (typeof params.password == 'function') {
                        password = await params.password(adm, new LogicChain(adm, this.logger));
                    }
                    else password = params.password;

                    const salt = bcrypt.genSaltSync(saltRounds);
                    const verifier = bcrypt.hashSync(password, salt);

                    adm.setResultInternal({
                        salt,
                        verifier,
                    }, 'ResetPassword->else');
                    adm.previousStepSuccessful = true;
                    adm.setSuccess(`Reset password successful`);

                    if (typeof params.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }
                }
                catch (e) {
                    const em = `Reset password unsuccessful: "${e.message || e}"`;

                    this.logger.error(`Reset password unsuccessful: ${e.message}`, 'Decorators: ResetPasswored: catch', adm);

                    adm.previousStepSuccessful = false;
                    adm.setError(em);

                    if (typeof params.onError == 'function') {
                        await params?.onError(adm, new LogicChain(adm, this.logger));
                    }

                    throw em;
                }
            }
        }

        addActionToQueue(target, cb, 'ResetPassword', params);
    }
}