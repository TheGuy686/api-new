import ActionDataManager from '../../classes/ActionDataManager';
import { BaseModel } from '../../base';
import { EModel } from '../../decorators/models';
import { generateRandomString } from '../../libs/StringMethods';

import entityDefaults from '../../consts/entity-defaults';

const defaultKeys: any = entityDefaults.defaultKeys;

class DummyModel {
    __id: string = generateRandomString(5);
    ds?: any;
    table?: string;
    _srcId: string = '_dummyMdl';

    repo: any;

    public _relationCallbacks: Function[] = [];

    static validationErrors: any = {};
    static classKeys: any = {};

    static getParentName() { return '' }

    serialize(ignoreWhereProps: boolean = false, serializeAll: boolean = false, adm: ActionDataManager): Object {return {}}

    static _getUIDKeys(child: any) : Object {return child._getOneKeys}

    static _getUID(child: any) : any {}

    static fromObj(obj: any, context: any = {}) {return new context()}

    recycle(obj: any, src: string) {Object.assign(this, obj)}

    public static getClassProperties(targetClass: string) : any {}
}

export function getDefaultModel(type: DEFAUL_BASE_REPO_TYPE) {
    switch (type) {
        case 'FileStorage': {
            // @EModel()
            class DefaultFileStoreModel extends DummyModel {};

            const ins = DefaultFileStoreModel;

            Object.defineProperty(ins, 'metadata', {
                value: {
                    isDefault: true,
                },
                writable: false,
                configurable: false,
            });

            return { name: defaultKeys.FileStorage, ins };
        }
        case 'SmtpMailService': {
            // @EModel()
            class DefaultEmailServModel extends DummyModel {};

            const ins = DefaultEmailServModel;
            
            Object.defineProperty(ins, 'metadata', {
                value: {
                    isDefault: true,
                },
                writable: false,
                configurable: false,
            });

            return { name: defaultKeys.SmtpMailService, ins };
        }
    }

}