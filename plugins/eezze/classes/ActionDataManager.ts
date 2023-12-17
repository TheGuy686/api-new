import { generateRandomString } from '../libs/StringMethods';
import Logger from './Logger';
import Stash from './Stash';

class ActionStep {
    private _actionSrc: string;
    private _id: string;
    private _logger: Logger;
    private _result: any = {};
    private _previousResult: any = {};
    private _cachedResult: any;
    private _runError: string = '';
    private _responseCode: number;
    private _resultChangeStack: string[] = [];
    private _stash: any = new Proxy({}, {
        get(target: any, prop: any, receiver: any) {
            // By default, it looks like Reflect.get(target, prop, receiver)
            // which has a different value of `this`
            return target[prop];
        },
        set(target: any, prop: any, value: any) {
            return target[prop] = value;
        }
    });

    private itteration = 0;
    private _tmpStorage = {};

    private _resultsOverridden = false;
    private _skipped = false;

    public get stash() { return this._stash }
    public get skipped() { return this._skipped }
    public get result(): any { return this._result }
    public get previousResult(): any { return this._previousResult }
    public get actionSrc(): any { return this._actionSrc }
    public get tmpResult(): any { return this._tmpStorage }
    public get cachedResult(): any { return this._cachedResult }
    public get runError(): string { return this._runError }
    public get responseCode(): number { return this._responseCode }
    public get hasResponseCode(): boolean { return typeof this._responseCode !== 'undefined' }
    public get resultsOverridden() { return this._resultsOverridden }

    public set resultsOverridden(value: any) {
        if (this._resultsOverridden) {
            console.log('Stopped the setting of "resultsOverridden", Value: ', value);
            return;
        }

        this._resultsOverridden = value;
    }

    constructor(id: string | number, logger: Logger, src: string) {
        if (typeof id == 'number') {
            this._id = `action-step-${id}`;
        }
        else this._id = id;

        this._logger = logger;
        this._actionSrc = src;
    }

    public skipAction() { this._skipped = true; }

    public setCacheResults(result: any): boolean {
        try {
            if (typeof this.cachedResult != 'undefined' && this.cachedResult != '') {
                if (Array.isArray(this.cachedResult) && !Array.isArray(result)) {
                    throw new Error(`ActionStep.setCacheResult: result must be of "array" type. Got "${typeof result}"`);
                }

                if (typeof this.cachedResult == 'object' && typeof result != 'object') {
                    throw new Error(`ActionStep.setCacheResult: result must be of "object" type. Got "${typeof result}"`);
                }
            }

            if (Array.isArray(result)) {
                // set default to the relative type if this is the first time its being run / cached
                if (typeof this._cachedResult == 'undefined') this._cachedResult = [];
                this._cachedResult = [...this._cachedResult, ...result];
            }
            else if (typeof result === 'object') {
                // set default to the relative type if this is the first time its being run / cached
                if (typeof this._cachedResult == 'undefined') this._cachedResult = {};
                this._cachedResult = { ...this._cachedResult, ...result };
            }
            else {
                // set default to the relative type if this is the first time its being run / cached
                if (typeof this._cachedResult == 'undefined') this._cachedResult = '';
                this._cachedResult = `${this._cachedResult}\n${result}`
            }
        }
        catch (err: any) {
            this._logger.critical(`There was an error setting your cache result, Error - ${err.message}`);
            return false;
        }

        return true;
    }

    public setPreviousResult(result: any, src: string) {
        if (typeof result == 'undefined') {
            console.log('  -------------------------------------------------- ');
            console.log('ADM->setPreviousResult: This is an issue. There is an undefined getting set', src);
        }

        if (Array.isArray(result)) {
            this._previousResult = [...result];
        }
        else if (typeof result === 'object') {
            this._previousResult = { ...result };
        }
        else {
            this._previousResult = `${result}`
        }

        // this._result = data;

        if (this.itteration == 0) {
            this.itteration++;
            this._tmpStorage = result;
        }

        Object.freeze(this._previousResult);
    }

    public setResult(result: any, src: string) {
        if (typeof result == 'undefined') {
            console.log('  -------------------------------------------------- ');
            console.log('ADM->setResult: This is an issue. There is an undefined getting set', src);
        }

        if (Array.isArray(result)) {
            this._result = [...result];
        }
        else if (typeof result === 'object') {
            this._result = { ...result };
        }
        else {
            this._result = `${result}`
        }

        // this._result = data;

        if (this.itteration == 0) {
            this.itteration++;
            this._tmpStorage = result;
        }

        Object.freeze(this._result);

        this._resultChangeStack.push(src);
    }

    public set(key: string, data: any) {
        if (typeof this._result[key] != 'undefined') {
            this._logger.warnI(`ActionStep.error: "${this._id}" -> action data with key "${key}" already exists`);
            return;
        }
        this._result[key] = data;
    }

    public get(key: string) {
        if (typeof this._result[key] === 'undefined') {
            this._logger.warnI(`ActionStep.get.error: "${this._id}" -> Data with key "${key}" doesn't exist`);
            return;
        }
        return this._result[key];
    }

    public setResponseCode(code: number) { this._responseCode = code }

    public dump() {
        return {
            src: this._actionSrc,
            id: this._id,
            result: this.result,
            cachedResult: this.cachedResult,
            runError: this.runError,
            responseCode: this.responseCode,
            hasResponseCode: this.hasResponseCode,
            _tmpStorage: this._tmpStorage,
            changeLog: this._resultChangeStack,
        }
    }
}

export default class ActionDataManager {
    public __id: string = generateRandomString(5);
    private _request: E_REQUEST;
    private _state: E_REQUEST_STATE;
    private _stash: Stash = new Stash();
    private _logger: Logger;
    private _input: any = {};
    private _actions: { [key: string]: ActionStep } = {};
    private _previousStepSuccessful: boolean = false;
    // these two vars hold the resul paramsts of the previous step successful result or error
    private _result: any = {};
    private _error: string = '';
    private _success: string = '';
    private _lastRanActionKey: string | number = '0';

    private _authAction: ActionStep;

    public get lastActionWasAuth() {
        return !!(Object.keys(this._actions).length == 0 && this._authAction instanceof ActionStep);
    }

    public get logger() { return this._logger }

    public get lastActionWasSkipped(): boolean {
        try {
            return this.getLastAction().skipped;
        }
        catch (err) { return false }
    }
    public get totalActions() { return Object.keys(this?._actions ?? {}).length }
    public get input(): any { return this._input }
    public get request(): E_REQUEST { return this._request }
    public get result(): any {
        if (this.lastActionWasAuth) return this._authAction.result;
        return this._result;
    }
    public get state(): any { return this._state }
    public get stash(): any { return this._stash.stash }
    public get currentAction() {
        if (this.lastActionWasAuth) return this._authAction;

        const indexes = Object.keys(this._actions);
        const lastIndex = indexes[indexes.length - 1];
        return this._actions[lastIndex];
    }
    public get cachedResult(): any {
        return this.currentAction.cachedResult;
    }
    public get responseCode() { return this.currentAction.responseCode }
    public get error(): any { return this._error }
    public get success(): any { return this._success }
    public set result(data: any) { this._result = data }
    public get previousStepSuccessful(): boolean { return this._previousStepSuccessful }
    public set previousStepSuccessful(value: boolean) {
        // this makes sure there is no straggling success results left behind if the opperation was unsuccessful
        if (!value) {
            this._result = {};
            this._success = '';
        }
        this._previousStepSuccessful = value;
        this.incrementKey();
    }
    public get actionErrors(): { [key: string]: string } {
        const errors: { [key: string]: string } = {};

        for (const key in this._actions) {
            errors[key] = this._actions[key].runError;
        }

        return errors;
    }
    public get previousResult(): any { return this.getLastAction()?.previousResult ?? [] }

    constructor(req: E_REQUEST, logger: Logger) {
        this._request = req;
        this._logger = logger;
    }

    public invalidateAuthAction() { 
        this._authAction = undefined;
        this._result = null;
    }

    public serverState() {
        return this.request.server.serverState;
    }

    public clearStash() { return this._stash.clearStash() }

    public channelState(channel: string) {
        if (this.request.type != 'ws') {
            console.log(`The channel state is only available for "websocket" type requests`);
            return {};
        }

        const sstate = this.serverState();

        if (typeof sstate[channel] != 'object') {
            // console.log(`There is currently no channel with any valid state or subsctibers with the name "${channel}"`);
            // console.log('State: ', this.request.server, sstate);
            // return {};

            this.request.server.initChannelState(channel);
        }

        return sstate[channel];
    }

    public skipAction() {
        this.currentAction.skipAction();
        this.previousStepSuccessful = true;
        this.setSuccess(`Action was skipped`);
        this.setResultInternal(true, 'ADM->skipAction');
    }

    public setState(state: E_REQUEST_STATE) { this._state = state }

    public setResponseCode(code: number) {
        this.currentAction.setResponseCode(code);
    }

    public get nextActionInput(): any {
        let lastAction;

        try {
            lastAction = this.getLastAction();

            return lastAction.result();
        }
        catch (err) { }

        return this.input;
    }

    public listActionsAndResults() {
        const actions = Object.values(this._actions);

        for (const i in actions) {
            const a = actions[i];
            console.log(`Action "${i}"`);
            console.log(a.dump());
        }
    }

    public getLastAction(): ActionStep {
        if (Object.keys(this._actions).length === 0) {
            this.setAction('ADM->getLastAction', this._lastRanActionKey);
        }

        return this._actions[this._lastRanActionKey];
    }

    public getResponse() {
        const la = this.currentAction;

        // get the success response
        if (la.responseCode > 199 && la.responseCode < 300) {
            return this.getSuccessResponse();
        }

        // default to error response
        return this.getErrorResponse();
    }

    public getErrorResponse(): any {
        const la = this.currentAction;

        let body: any;

        // here we default to the cached result of the last run action
        if (typeof la == 'object' && typeof la.cachedResult != 'undefined') {
            body = la.cachedResult;
        }
        // default to the current result of the ADM
        else body = { ...this._result };

        // set the message of the response if there is a success message supplied
        if (this._error !== '') {
            body.message = this._error;
        }

        return {
            statusCode: la?.hasResponseCode ? la.responseCode : 500,
            success: la?.hasResponseCode ? true : false,
            body
        };
    }

    public getSuccessResponse(): any {
        const la = this.currentAction;

        let body: any;

        try {
            // this condition should only happen on an EAction condition exception!
            // reason: there's no Action initialized yet.
            if (typeof la === 'undefined') {
                return {
                    statusCode: 200,
                    success: true,
                    body: {}
                }
            }
            // here we default to the cached result of the last run action
            else if (la && typeof la.cachedResult != 'undefined') {
                body = la.cachedResult;
            }
            else if (Array.isArray(this._result)) {
                body = [...this._result];
            }
            else if (typeof this._result == 'object') {
                body = { ...this._result };
            }
            else if (typeof this._result === 'boolean') {
                body = { result: this._result }
            }
            else if (typeof this._result === 'string') {
                body = { result: this._result }
            }
            // default to the current result of the ADM
            else body = this._result;

            // set the message of the response if there is a success message supplied
            if (this._success !== '') body.message = this._success;

            return {
                statusCode: la.hasResponseCode ? la.responseCode : 200,
                success: true,
                body
            };
        }
        catch (err: any) {
console.log('err: ', err);
            this._logger.critical(`There was an error setting the success response, Error - ${err.message}`);
            return {
                statusCode: 500,
                success: false
            };
        }
    }

    public incrementKey() {
        const keys = Object.keys(this._actions);
        this._lastRanActionKey = keys[keys.length - 1]
    }

    public setSuccess(successMessgae: string) { this._success = successMessgae }
    public setError(error: string) {
        this._error = error;
        this.setResultInternal({}, 'ADM->setError');
    }

    private _setResult(result: any, src: string, isExternal: boolean = false) {
        this._result = result;

        if (typeof this.currentAction === 'undefined') {
            this.setAction('ADM->setResult', this._lastRanActionKey);
        }

        const lastAction = this.currentAction;

        if (lastAction.resultsOverridden) return;

        if (Array.isArray(result)) {
            lastAction.setResult([...result], `${lastAction.actionSrc}: ADM->array->${src}`);
        }
        else if (typeof result == 'object') {
            lastAction.setResult({ ...result }, `${lastAction.actionSrc}: ADM->object->${src}`);
        }
        else if (typeof result == 'number') {
            lastAction.setResult(Number(result), `${lastAction.actionSrc}: ADM->number->${src}`);
        }
        else if (typeof result == 'string') {
            lastAction.setResult(String(result + ''), `${lastAction.actionSrc}: ADM->string->${src}`);
        }
        else if (typeof result == 'boolean') {
            lastAction.setResult(Boolean(result), `${lastAction.actionSrc}: ADM->boolean->${src}`);
        }
        else {
            lastAction.setResult(result + '', `${lastAction.actionSrc}: ADM->else ${typeof result}->${src}`);
        }

        if (isExternal) {
            lastAction.resultsOverridden = true;
        }
    }

    public setResultInternal(result: any, src: string = '') {
        if (!this?.currentAction?.resultsOverridden) {
            this._setResult(result, src, false);
        }
    }

    public setResult(result: any, src: string = '') {
        this._setResult(result, src, true);
    }

    public setInput(vars: object) {
        if (typeof vars == 'undefined' || Object.keys(vars).length == 0) return;
        this._input = vars;
    }

    public get(key: string) {
        if (typeof this._input[key] == 'undefined') {
            this._logger.warnI(`Input data key "${key}" does not exist`);
            return;
        }
        return this._input[key];
    }

    public setAction(src: string, key: string | number = Object.keys(this._actions).length, isAuth: boolean = false) {
        this._previousStepSuccessful = false;
        this._error = '';
        this._success = '';

        if (isAuth) {
            this._authAction = new ActionStep(key, this._logger, src);
        }
        else {
            this._actions[key] = new ActionStep(key, this._logger, src);
        }
    }

    public action(key: string | number): ActionStep {
        let k = key;

        if (typeof key == 'number') k = `action-step-${key}`;

        if (typeof this._actions[key] == 'undefined') {
            this._logger.warnI(`Action Step with key "${key}" doesn't exist`);
            return;
        }

        return this._actions[key];
    }

    public get hasPreviousAction(): boolean {
        if (Object.keys(this._actions).length > 0) {
            const lastAction = this.getLastAction();

            if (typeof lastAction.result !== 'undefined') return true;
        }
        return false;
    }

    public cacheResults(result: any): boolean {
        const act = this.currentAction;
        const res = act.setCacheResults(result);

        return res;
    }
}