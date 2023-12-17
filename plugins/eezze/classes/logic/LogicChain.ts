import Logger from '../Logger';
import EMath from './math';
import EDate from './date';
import { isPromise } from '../../libs/ObjectMethods';
import EText from './text';
import EJson from './json';
import EObject from './object';
import EArray from './array';
import ActionDataManager from '../ActionDataManager';
import { ESet } from './misc';
import Deps from '../../consts/connection-deps';
import { arrayContains } from 'class-validator';

type RETURN_TYPES = 'text' | 'string' | 'list' | 'object' | 'number' | 'boolean' | 'void' | 'date';

export default class LogicChain {
    private logger: Logger;
    private opQue: {source: string, returns: string, cb: Function}[] = [];

    private adm: ActionDataManager;

    private _last: any;
    private _current: any;
    private _has: any;
    private _deps: any;

    private _string: any;
    private _date: any;
    private _json: any;
    private _number: any;
    private _list: any;
    private _object: any;
    private _boolean: any;
    private _void: any;
    private _assign: any;
    private _state: any;
    private _stash: any;

    private _props: any = {};

    private _changeLog: object[] = [];

    public get text() {return this._string};
    public get date() {return this._date};
    public get json() {return this._json};
    public get number() {return this._number};
    public get list() {return this._list};
    public get object() {return this._object};
    public get boolean() {return this._boolean};
    public get void() {return this._void};
    public get assign() {return this._assign};
    public get state() {return this._state};
    public get stash() {return this._stash};

    public get current() { return this._current }
    public get last() { return this._last }
    public get has() {return this._has};

    constructor(adm: ActionDataManager, logger: Logger) {
        this.logger = logger;
        this.adm = adm;

        const self = this;

        this._deps = Deps;

        this._number = {
            ...this.getTypeMethods('number'),
            custom: this.custom('number'),
        };

        this._string = {
            ...this.getTypeMethods('string'),
            custom: this.custom('string'),
        };

        this._date = function (dte: any) {
            let d;

            if (typeof dte == 'object') d = dte;
            else {
                d = EDate.getDate(dte);
            }

            return {
                ...this.dateMethods(d),
                custom: this.custom('date'),
            };
        };

        this._boolean = {
            ...this.getTypeMethods('boolean'),
            custom: this.custom('boolean'),
        };

        this._list = function (obj: object = []) {
            self.opQue.push({
                source: 'assign-list',
                returns: 'list',
                async cb() {
                    await self.setCurrent('assign-list', obj);
                },
            });

            return {
                ...this.listMethods(obj),
                custom: this.custom('list'),
            };
        };

        this._object = function (obj: object = {}) {
            self.opQue.push({
                source: 'assign-object',
                returns: 'object',
                async cb() {
                    await self.setCurrent('assign-object', obj);
                },
            });

            return {
                ...this.objectMethods(obj),
                custom: this.custom('object'),
            };
        };

        this._void = {
            ...this.getTypeMethods('void'),
            custom: this.custom('void'),
        };

        this._json = {
            ...this.getTypeMethods('json'),
            // custom: this.custom('void'),
        };

        this._assign = {
            number: this._assignCb('number'),
            text: this._assignCb('string'),
            date: this._assignCb('date'),
            boolean: this._assignCb('boolean'),
            list: this._assignCb('list'),
            object: this._assignCb('object'),
        };

        this._state = {
            assign: {
                number: this._assignCb('number', true),
                text: this._assignCb('string', true),
                date: this._assignCb('date', true),
                boolean: this._assignCb('boolean', true),
                list: this._assignCb('list', true),
                object: this._assignCb('object', true),
            },
            prop(key: string, nullable: boolean = false) {
                if (typeof self.adm.state[key] == 'undefined' && !nullable) {
                    throw new Error(`State "${key}" doesn't exist`);
                }

                return self.adm.state[key];
            },
        };

        this._stash = {
            assign: {
                number: this._assignCb('number', false, true),
                text: this._assignCb('string', false, true),
                date: this._assignCb('date', false, true),
                boolean: this._assignCb('boolean', false, true),
                list: this._assignCb('list', false, true),
                object: this._assignCb('object', false, true),
            },
            prop(key: string, nullable: boolean = false) {
                if (typeof self.adm.stash[key] == 'undefined' && !nullable) {
                    throw new Error(`Stash "${key}" doesn't exist`);
                }

                return self.adm.stash[key];
            },
        };

        this._has = {
            dep (source: string, deps: string[]) {
                if (typeof self._deps[source] == 'undefined') throw new Error(`LogicChain.constructor.has.dep.error: Undefined source type`);

                try {
                    return EArray.arrayEqual(self._deps[source], deps).length > 0;
                }
                catch (error) {
                    return false;
                }
            }
        }
    }

    public log(arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any) {
        const args = [
            arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8
        ];

        this.opQue.push({
            source: `logic-chain-log`,
            returns: 'void',
            cb: () => {
                console.log.apply(console.log, args.filter((arg: any) => arg != undefined).map((arg: any) => {
                    if (typeof arg == 'function') return arg();

                    return arg;
                }));
            }
        });
    }

    private listMethods(obj: any) {
        const methods: any = this.getTypeMehthods('list');
        const mtsIn: any = {};

        const self = this;

        for (const m in methods) {
            mtsIn[m] = function () {
                const argsIn = [obj, ...arguments],
                          cb = methods[m];

                self.opQue.push({
                    source: m,
                    returns: 'list',
                    async cb() {
                        await self.setCurrent('list-' + m, cb.apply(cb, argsIn));
                    }
                });
            };
        }

        return mtsIn;
    }

    private objectMethods(obj: any) {
        const methods: any = this.getTypeMehthods('object');
        const mtsIn: any = {};

        const self = this;

        for (const m in methods) {
            mtsIn[m] = function () {
                const argsIn = [obj, ...arguments],
                          cb = methods[m];

                self.opQue.push({
                    source: m,
                    returns: 'object',
                    async cb() {
                        await self.setCurrent('object-' + m, cb.apply(cb, argsIn));
                    }
                });
            };
        }

        return mtsIn;
    }

    private dateMethods(dte: any) {
        const methods: any = this.getTypeMehthods('date');
        const mtsIn: any = {};

        const self = this;

        for (const m in methods) {
            mtsIn[m] = function () {
                const argsIn = [dte, ...arguments],
                        cb = methods[m];

                self.opQue.push({
                    source: m,
                    returns: 'string',
                    async cb() {
                        await self.setCurrent('date-' + m, cb.apply(cb, argsIn));
                    }
                });
            };
        }

        return mtsIn;
    }

    private getTypeMethods(returns: string) {
        const methods: any = this.getTypeMehthods(returns);
        const mtsIn: any = {};

        const self = this;

        for (const m in methods) {
            mtsIn[m] = function () {
                const argsIn = arguments,
                      cb = methods[m];

                self.opQue.push({
                    source: m,
                    returns,
                    async cb() {
                        await self.setCurrent(returns + '-' + m, cb.apply(cb, argsIn));
                    }
                });
            };
        }

        return mtsIn;
    }

    private getTypeMehthods(type: string) {
        switch (type) {
            case 'number': return EMath.toObj();
            case 'date': return EDate.toObj();
            case 'object': return {
                ...EObject.toObj(),
                json: EJson.stringify,
            };
            case 'list': return {
                ...EArray.toObj(),
                json: EJson.stringify,
            };
            case 'json': return {
                ...EJson.toObj(),
            };

            // default to string
            default: return EText.toObj();
        }
    }

    private async setCurrent(source: string, value: any) {
        this._current = typeof value == 'function' ? await value(this.current) : value;

        this._changeLog.push({ source, value });
    }

    private _assignCb(
        type: RETURN_TYPES,
        isState: boolean = false,
        isStash: boolean = false
    ) {
        return (key: string, value: any) => {
            this.setLast();

            const self = this;

            let prefix = '';

            if (isState) prefix = 'state-';
            else if (isStash) prefix = 'stash-';

            this.opQue.push({
                source: `${prefix}${type}-assign`,
                returns: `${type}`,
                cb: async function () {
                    try {
                        let res: any;

                        if (typeof value == 'function') {
                            const lc = new LogicChain(this.adm, this.logger);
                            res = isPromise(value) ? await value(lc, this._last) : value(lc, this._last);
                        }
                        else res = value;

                        const rtype = typeof res;

                        // this is becase if the output of the current action is "void"
                        // then we don't need to care what the output is if the operation
                        // didn't trigger the catch with any internal errors
                        if (type == 'void') return;

                        if (type == 'list') {
                            if (!Array.isArray(res)) {
                                throw new Error(`Assign list value "${key}" Type mismatch. Expected an "array" got "${rtype}"`);
                            }
                        }
                        else if (rtype != type) {
                            throw new Error(`Assign primitive value "${key}" Type mismatch. Expected "${type}" got "${rtype}"`);
                        }

                        await self.setCurrent(`${prefix}${type}-assign`, res);

                        if (isState) {
                            ESet(self.adm.state, key, res);
                        }
                        else if (isStash) {
                            ESet(self.adm.stash, key, res);
                        }
                        else ESet(self._props, key, res);

                        return res;
                    }
                    catch (err) {
                        console.log(err);
                        throw new Error(`There was an error running the assignment, Error: "${err.message || err}"`);
                    }
                }.bind({
                    type,
                    isState,
                    isStash,
                    key,
                    value
                }),
            });
        }
    }

    public prop(key: string, nullable: boolean = false) {
        if (typeof this._props[key] == 'undefined' && !nullable) {
            throw new Error(`Prop "${key}" doesn't exist`);
        }

        return this._props[key];
    }

    private setLast() {
        switch (typeof this._current) {
            case 'string': this._last = `${this._current}`; break;
            case 'number':
                const cu = this._last = `${this._current}`;

                if (cu.indexOf('.')) this._last = parseFloat(cu);
                else this._last = parseInt(cu);

                break;

            case 'boolean': this._last = this._current; break;
            case 'object':
                if (Array.isArray(this._current)) {
                    this._last = [...this._current];
                }
                else this._last = {...this._current};

            case 'undefined': this._last = undefined; break;
        }
    }

    private custom(type: RETURN_TYPES) {
        return (cb: Function) => {
            this.setLast();

            this.opQue.push({
                source: `${type}-custom`,
                returns: type,
                cb: async () => {
                    try {
                        const res = await cb(this._last ?? this._current);
                        const rtype = typeof res;

                        // this is becase if the output of the current action is "void"
                        // then we don't need to care what the output is if the operation
                        // didn't trigger the catch with any internal errors
                        if (type == 'void') return;

                        if (type == 'list' && !Array.isArray(res)) {
                            console.log(res);
                            throw new Error(`Type mismatch -> List check. Expected "${type}" got "${rtype}"`);
                        }
                        else if (rtype != type && type != 'list') {
                            throw new Error(`Type mismatch -> primitive check. Expected "${type}" got "${rtype}"`);
                        }

                        this._current = res;

                        return res;
                    }
                    catch (err) {
                        throw new Error(`There was an error running the custom code, Error: "${err.message || err}"`);
                    }
                },
            });
        }
    }

    public history() {
        let e: any;

        this.logger.info('                   ');

        this.logger.info('       Logic chain history: ');

        for (e of this._changeLog) {
            this.logger.info(`"${e.source}"->"${typeof e.value == 'object' ? JSON.stringify(e.value) : e.value}"`);
        }
    }

    public async result() {
        try {
            for (const r of this.opQue) await r.cb();
            return this._current;
        }
        catch (err) {
console.log('ERROR: ', err);
            this.logger.critical(err);
            throw err;
        }
    }
}