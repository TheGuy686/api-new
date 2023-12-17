import { isPromise } from '../../../libs/ObjectMethods';
import EezzeTpl from '../../../classes/EezzeTpl';
import { addActionToQueue } from '..';
import { Service } from '../../../classes/ServiceBus';
import { eexec } from '../../../libs/Command';
import ActionDataManager from '../../../classes/ActionDataManager';
import LogicChain from '../../../classes/logic/LogicChain';

interface CreateMigrationArgsI {
    entity: string;
    definition?: (adm: ActionDataManager, lc?: LogicChain) => object;
}

interface RunMigrationArgsI {
    entity: string;
}

/**
 * CreateMigration
 *
 * 1. retrieve entity; params.entity
 * 2. retrieve datasource; entity.ds, try/catch context error catching
 * 3. set definition var to action-input default; if params.definition override.
 * 4. return stringified json
 * 5. run RenderTemplate decorator
 *
 * @param params
 * @returns
 */
export function CreateMigration (params: CreateMigrationArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value.bind(target);

        const cb = async function CreateMigration_OR (adm: ActionDataManager) {
            adm.setAction('CreateMigration_OR: ' + adm.totalActions);

            this.logger.info('Decorators->Migration->CreateMigration Success', 'Decorators->Migration->CreateMigration Success', adm, [ 'info' ]);
        }
    }
}

/**
 * RunMigration
 *
 * 1. retrieve entity; params.entity
 * 2. retrieve datasource; entity.ds, try/catch context error catching
 * 3. get datasource type processing library (sequealize)
 * 4. run migration/operation
 *
 *
 * @param params
 * @returns
 */
export function RunMigration (params: RunMigrationArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value.bind(target);

        const cb = async function RunMigration_OR (adm: ActionDataManager) {
            adm.setAction('RunMigration_OR: ' + adm.totalActions);

            this.logger.info('Decorators->Migration->RunMigration Success', 'Decorators->Migration->RunMigration Success', adm, [ 'info' ]);
        }
    }
}
