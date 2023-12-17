export default class RestState {
    private _state: any = new Proxy({}, {
        get(target: any, prop: any, receiver: any) {
          // By default, it looks like Reflect.get(target, prop, receiver)
          // which has a different value of `this`
          return target[prop];
        },
        set(target: any, prop: any, value: any) {
            return target[prop] = value;
        }
    });

    public get state() {return this._state}
}