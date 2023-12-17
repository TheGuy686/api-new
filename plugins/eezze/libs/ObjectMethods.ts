import { getStringCases } from './StringMethods';

const AsyncFunction = (async () => {}).constructor;

export function stringifyToNoQutedKeys(obj: any) : string {
    if (typeof obj !== 'object' || Array.isArray(obj)){
        // not an object, stringify using native function
        return JSON.stringify(obj, null, 4);
    }

    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    const props = Object
        .keys(obj)
        .map(key => {
            const cases = getStringCases(key);
            return `${key}:${stringifyToNoQutedKeys(obj[cases.camelCase])}` + "\n";
        })
        .join(',');

    return `{\n${props}}`;
}

export function mergeObjects(target: object, fromObject: object) {
    // here the properties from the fromObject get copied into the target object
    return Object.assign(target, fromObject);
}

export function flattenObj(ob: any) : string[] {
    const toReturn: any = {};

    for (const i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            const flatObject = flattenObj(ob[i]);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

export function filterObjectKeys(obj: any, disallowed: string[] = []) {
    return Object.keys(obj)
        .filter(key => !disallowed.includes(key))
        .reduce((obj: any, key) => {
            obj[key] = obj[key];
            return obj;
        }, {});
}

/**
 * Determine whether the given `promise` is a Promise.
 *
 * @param {*} promise
 *
 * @returns {Boolean}
 */
export function isPromise(func: any) {
    if (func instanceof AsyncFunction) return true;
    return !!func && typeof func.then === 'function';
}

export function filterNullValues(obj: any): any {
    // Deep clone the object and then filter out null values
    const clonedObject: any = JSON.parse(JSON.stringify(obj));
  
    function filterNull(obj: any) {
      for (const key in obj) {
        if (obj[key] === null) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          filterNull(obj[key]);
        }
      }
    }
  
    filterNull(clonedObject);
  
    return clonedObject;
}