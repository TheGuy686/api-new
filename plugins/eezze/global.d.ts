import { Connection, ConnectionServer, ConnectionAWS } from './base';
import { ActionDataManager, EezzeRequest, EezzeWsRequest, LogicChain, RestState, WsState } from './classes';

export {};

interface FAIL_ON_CONDITIONAL_ITEM_MESS {
    condition: E_CM_CB_BOOL;
    message?: E_CM_CB_STR | string;
}

declare global {
    type RESTFUL_METHODS = 'get' | 'post' | 'delete' | 'put';
    type KEY_VALUES = { [k in string | number]: any; };
    type KEY = string | number | symbol;
    type E_REQUEST = EezzeWsRequest | EezzeRequest;
    type E_REQUEST_STATE = RestState | WsState;
    type SQL_QUERY_PARAMS = any[];
    
    type E_CONNECTION = Connection | ConnectionServer | ConnectionAWS;
    type E_CONV_TYPES = 'image';
    type ECONN_SOURCE = 'aws' | 'gcp' | 'azure' | 'eezze';

    // Triggers the variable path feature in the action query decorators
    type DS_TYPE_FILE = 'FileStorage';
    type DS_TYPE_MYSQL = 'Mysql';
    type DS_TYPE_EMAIL = 'SmtpMailService';
    type DS_QUERY_VAR_MERGE_TYPES = [ DS_TYPE_FILE ];
    type T_DS_DB_TYPES = [ DS_TYPE_MYSQL ];

    type E_BASE64_IMAGE_TYPES = 'jpeg' | 'jpg' | 'gif' | 'png' | 'bmp' | 'tiff' | 'webp' | 'svg' | 'ico' | 'jfif' | 'pjpeg' | 'pjp' | 'avif' | 'apng' | 'heif' | 'bat' | 'bpg' | 'cr2' | 'cur' | 'ecw' | 'dds' | 'dng' | 'exr' | 'f4a' | 'f4b' | 'f4p' | 'f4v' | 'flif' | 'webp';
    type E_BASE64_OUTPUT_TYPES = 'image';

    type E_CONVERSION_OUTPUT_TYPES = E_BASE64_OUTPUT_TYPES;

    type LC_STR = Promise<string>;
    type LC_STR_ARR = Promise<string[]>;
    type LC_NUM = Promise<number>;
    type LC_BOOL = Promise<boolean>;
    type LC_OBJ = Promise<object>;
    type LC_ANY = Promise<any>;
    type LC_FUNC = Promise<Function>;
    type LC_VOID = Promise<void>;

    type E_CM_CB_STR = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (string | LC_STR));
    type E_CM_CB_STR_ARR = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (string[] | LC_STR_ARR));
    type E_CM_CB_NUM = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (number | LC_NUM));
    type E_CM_CB_BOOL = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (boolean | LC_BOOL));
    type E_CM_CB_OBJ = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (object | LC_OBJ));
    type E_CM_CB_ANY = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (any | LC_ANY));
    type E_CM_CB_FUNC = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (Function | LC_FUNC));
    type E_CM_CB_VOID = ((adm: ActionDataManager, lc?: LogicChain, addData?: any) => (void | LC_VOID));

    type ECONDITIONAL_ITEM = FAIL_ON_CONDITIONAL_ITEM_MESS | E_CM_CB_BOOL;

    type E_AUTH_TYPE = 'jwt';

    type BASE_REPO_TYPES = DS_TYPE_FILE | DS_TYPE_MYSQL | DS_TYPE_EMAIL;
    type DEFAUL_BASE_REPO_TYPE = DS_TYPE_FILE | DS_TYPE_EMAIL;
    type DEFAUL_BASE_REPO_TYPES = [ DS_TYPE_FILE | DS_TYPE_EMAIL ];
}