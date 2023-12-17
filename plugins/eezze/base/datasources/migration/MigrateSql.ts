import Logger from '../../../classes/Logger';
import { MYSQL_DATA_TYPES, MYSQL_RELATIONSHIP_TYPES } from './data-types';

interface DsArgsI {
	logger: Logger;
	datasourceType: string;
	includeDatabase?: boolean;
	[key: string]: any;
}

export default class MigrateSql {
	_srcId: string = '_migration';
	logger: Logger;

	constructor(args: DsArgsI) {
		this.logger = args.logger
	}

	/**
	 *
	 * @param key datatype name
	 * @returns Eezze plugin datatype name
	 */
	public getDataTypeName(key: string) {
		try {
			return MYSQL_DATA_TYPES[key];
		}
		catch (err) {
			const message = `Datatype: ${key} doesn't exist!`
			this.logger.errorI(message, 'MigrateSql: getDataTypeName');
			throw new Error(message);
		}
	}

	/**
	 *
	 * @param key relationship name
	 * @returns Eezze plugin relationship name
	 */
	public getRelationshipTypeName(key: string) {
		try {
			return MYSQL_RELATIONSHIP_TYPES[key];
		}
		catch (err) {
			const message = `Relationship: ${key} doesn't exist!`
			this.logger.errorI(message, 'MigrateSql: getRelationshipTypeName');
			throw new Error(message);
		}
	}
}