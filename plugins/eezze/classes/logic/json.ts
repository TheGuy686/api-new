export default class EJson {
    static parse(pl: any, def: any = {}) {
        if (!pl || typeof pl != 'string') return def;

        try {
            return JSON.parse(pl);
        }
        catch (err) { return def }
    }

    static parseArray(pl: any): object {
        const def: any[] = [];

        if (!pl || typeof pl != 'string') return def;

        try {
            const res = JSON.parse(pl);

            if (!Array.isArray(res)) return def;

            return res;
        }
        catch (err) { return def }
    }

    static parseObject(pl: any): any {
        const def: any = {};

        if (!pl || typeof pl != 'string') return def;

        try {
            const res = JSON.parse(pl);

            return res;
        }
        catch (err) {
            console.log('Error: ', err);
            return def;
        }
    }

    static parseKeyObject(obj: any, key: string | number) {
        try {
            if (typeof obj?.[key] == 'object') return obj?.[key];
            return JSON.parse(obj?.[key] ?? '{}');
        }
        catch (err) { return {} };
    }

    static parseKeyArray(obj: any, key: string | number) {
        try {
            if (Array.isArray(obj?.[key])) return obj?.[key];
            return JSON.parse(obj?.[key] ?? '[]');
        }
        catch (err) { return [] };
    }

    static stringify(pl: any, arg2?: string | boolean, arg3?: boolean) {
        let def = '{}', prettify = false;

        try {
            if (typeof arg2 == 'string') def = arg2;
            if (typeof arg2 == 'boolean') prettify = arg2;
            if (typeof arg3 != 'undefined') prettify = arg3;

            if (!prettify) return JSON.stringify(pl);

            return JSON.stringify(pl, null, 4);
        }
        catch (err) { return def }
    }

    static pj(pl: any) {
        try {
            return JSON.stringify(pl, null, 4);
        }
        catch (err) {
            if (typeof pl == 'string') return pl;
            return '{}';
        }
    }

    public static toObj() {
        return {
            pj: this.pj,
            stringify: this.stringify,
            parseKeyArray: this.parseKeyArray,
            parseKeyObject: this.parseKeyObject,
            parseObject: this.parseObject,
            parseArray: this.parseArray,
            parse: this.parse,
        };
    }
}