import { getLogger } from '..';
import { ConnectionServer, ConnectionAWS } from '../base';
import PDC from '../classes/ProjectDependancyCaches';

interface ConnectionArgsI {
    id: number;
    devIsSecure?: boolean;
    secure?: boolean;
    protocol?: string;
    alias?: string;
    secureProtocol?: string;
    localhost?: string;
    types: string[];
    ip?: string;
    port?: number | string;
    host?: string;
    user?: string;
    password?: string;
    storeState?: boolean;
    storeStateInterval?: number;
    path?: string;
    source?: ECONN_SOURCE;
}

const paramDefs: any = {
    ip: process.env.HOST_IP,
    devIsSecure: false,
    secure: false,
    protocol: 'http',
    secureProtocol: 'https',
    localhost: '0.0.0.0',
}

export function EConnection(pms: ConnectionArgsI) {
    return function <T extends new (...args: any[]) => {}>(constr: T) {

        const types = pms?.types;

        if (!Array.isArray(types)) throw new Error(`Connection must "type" must be set`);

        if (typeof pms?.ip == 'undefined')             pms.ip             = paramDefs.ip;
        if (typeof pms?.devIsSecure == 'undefined')    pms.devIsSecure    = paramDefs.devIsSecure;
        if (typeof pms?.secure == 'undefined')         pms.secure       = paramDefs.secure;
        if (typeof pms?.protocol == 'undefined')       pms.protocol       = paramDefs.protocol;
        if (typeof pms?.secureProtocol == 'undefined') pms.secureProtocol = paramDefs.secureProtocol;
        if (typeof pms?.localhost == 'undefined')      pms.localhost      = paramDefs.localhost;

        let con: E_CONNECTION, clss: any;

        switch (pms.source) {
            case 'aws':
                con = new ConnectionAWS(pms, constr.name, getLogger());

                PDC.cacheConnection(constr.name, con);

                clss = class ECONNECTION_OR extends constr {
                    con = con;
                }

                Object.defineProperty(constr, 'props', {
                    value: pms,
                    writable: false
                });

                return clss;

            default:
                con = new ConnectionServer(pms, getLogger());

                PDC.cacheConnection(constr.name, con);

                clss = class ECONNECTION_OR extends constr {
                    con = con;
                }

                Object.defineProperty(constr, 'props', {
                    value: pms,
                    writable: false,
                });

                return clss;
        }
    };
}