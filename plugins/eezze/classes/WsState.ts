import { generateRandomString } from '../libs/StringMethods';

export default class WsState {
    private __id: string = generateRandomString(5);
    private _stateChangeCb: Function;

    private _tmpState: any;

    private _lastChangedProp: string = '';

    public id() { return this.__id }

    constructor(doStateTmrCheck: boolean = false) {
        if (doStateTmrCheck) {
            setInterval(() => {

                const tmpSig = JSON.stringify({...this._tmpState});
                const stateSig = JSON.stringify({...this._state});

                if (tmpSig != stateSig) {
                    this._tmpState = JSON.parse(JSON.stringify(this._state));

                    if (this._lastChangedProp != '') {
                        this._stateChangeCb(this._lastChangedProp, {}, this._state);
                    }
                }

            }, 500);
        }
    }

    private _state: any = (() => {

        const self = this;

        return new Proxy({}, {
            get(target: any, prop: any, receiver: any) { return target[prop]},
            set(target: any, prop: any, value: any) {
                if (typeof self._stateChangeCb == 'function') {
                    setTimeout(() => {

                        self._stateChangeCb(prop, value, self._state);

                    }, 1);
                }

                self._lastChangedProp = prop;

                return target[prop] = value;
            }
        })
    })();

    public get state() { return this._state }

    public setStateChangeCb(cb: (prop: string, value: any, state: any) => any) {
        this._stateChangeCb = cb;
    }
}