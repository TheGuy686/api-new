import { DSArgsI } from '../interfaces/DSArgsI';
import { getLogger } from '..';
import Datasource from '../base/datasources';
import PDC from '../classes/ProjectDependancyCaches';

export function EDataSource(decoratorArgs: DSArgsI) {
    return function <T extends new (...args: any[]) => {}>(constr: any) {
        PDC.setDsDescArgs(constr.name, decoratorArgs);

        const props = {
            ...decoratorArgs,
            name: constr.name,
        };

        Object.defineProperty(constr, 'props', {
            value: props,
            writable: false,
        });

        constr.constructor.prototype.props = props;
        constr.prototype.props = props;

        return class EDATASOURCE_OR extends constr {
            ds = new Datasource(decoratorArgs, constr.name, getLogger());
        }
    };
}