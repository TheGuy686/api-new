export default class Stash {
    private _stash: any = new Proxy({}, {
        get(target: any, prop: any, receiver: any) {
          // By default, it looks like Reflect.get(target, prop, receiver)
          // which has a different value of `this`
          return target[prop];
        },
        set(target: any, prop: any, value: any) {
            target[prop] = value;
            return true;
        },
    });

    public get stash() {return this._stash}

    public clearStash() {
        this._stash = new Proxy({}, {
            get(target: any, prop: any, receiver: any) {
              // By default, it looks like Reflect.get(target, prop, receiver)
              // which has a different value of `this`
              return target[prop];
            },
            set(target: any, prop: any, value: any) {
                return target[prop] = value;
            }
        });
    }
}