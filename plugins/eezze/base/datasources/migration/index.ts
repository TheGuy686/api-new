import { kebabCase } from '../../../libs/StringMethods';
import Logger from '../../../classes/Logger';
import MigrateSql from './MigrateSql';

interface DsArgsI {
	logger: Logger;
	datasourceType: string;
	includeDatabase?: boolean;
	[key: string]: any;
}

export default class Migration {
    logger: Logger;
	_srcId: string = '_migration';
    lib: any;

	constructor(args: DsArgsI) {
        this.logger = args.logger;

		switch (kebabCase(args.datasourceType)) {
			case 'mysql':
				this.lib = new MigrateSql(args)
			default:
                throw new Error(`Datasource; ${args.datasourceType} is currently not supported for migration.`)
		}
	}
}