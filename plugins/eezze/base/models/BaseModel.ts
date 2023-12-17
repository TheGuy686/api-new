import { ActionDataManager } from '../../classes';
import RequestErrorMessagesI from '../../interfaces/RequestErrorMessagesI';
import { generateRandomString } from '../../libs/StringMethods';
import DatabaseSource from '../datasources';

type PROP_TYPE = Boolean | Number | String;

interface ClassKeysI {
    parentClass: string;
    properties: {[prop: string]: PROP_TYPE}
}

interface MainClassKeyPairs {[className: string]: ClassKeysI}
/**
 * Based on the DatabaseSource Type;
 *
 * If MySQL; toMigrationObject sequalize.define() model objects, default empty model object.
 *
 * Create migration file:
 *
 * 1. action input
 * 2. run @Migration decorator
 * 2.1. set property datasource entity name
 * 2.2. set property
 * 3. if definition callback exists, set definitin to callback else default to action input
 * 4. private method; getMigrationType({model.ds.type}) (DatabaseSource Type) if SQL, sequalize define.
 * 5. create migration file
 *
 * Run migration file:
 *
 * 1. pass file id.
 * 2. execute.
 */
export default class BaseModel {
    // @Ryan - bug here, underscore?
    __id: string = generateRandomString(5)
    ds?: DatabaseSource;
    table?: string;
    _srcId: string = '_mdl';

    repo: any;

    public _relationCallbacks: Function[] = [];

    static validationErrors: RequestErrorMessagesI = {};
    static classKeys: MainClassKeyPairs = {};

    static getParentName() { return '' }

    serialize(ignoreWhereProps: boolean = false, serializeAll: boolean = false, adm: ActionDataManager): Object {return {}}

    static _getUIDKeys(child: any) : Object {return child._getOneKeys}

    static _getUID(child: any) : Object {
        let out: any = {}, k: any;

        for (k of child._getOneKeys) {
            if (typeof child[k] == 'undefined')  {
                console.log(`BaseModel: _getUID - ${k} did not exist in the child class.`);
                continue;
            }

            out[k] = child[k];
        }

        return out;
    }

    static fromObj(obj: any, context: any = {}) {return new context()}

    recycle(obj: any, src: string) {Object.assign(this, obj)}

    public static getClassProperties(targetClass: string) : string[] {
        let out: any = {};

        if (typeof this.classKeys[targetClass] == 'undefined') return out;

        const targetClassObj = this.classKeys[targetClass];

        out = {...out, ...targetClassObj.properties};

        if (typeof targetClassObj.parentClass != 'undefined') {
            out = {...out, ...this.getClassProperties(targetClassObj.parentClass)};
        }

        return out;
    }
}