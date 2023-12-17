import Logger from '../../classes/Logger';
import Database from '../../interfaces/DatabaseI';
import {checkEnvVars} from '../../libs/utils';
import BaseModel from '../models/BaseModel';
import { RelationI, RelationRefI } from '../../interfaces/RelationsI';

export default class DynamoDb implements Database {
    db: any;
    isConnected: boolean = false;
    logger: Logger;
    _srcId: string = '_dynamodb';

    constructor(logger: Logger) {
        const checks = checkEnvVars([
            'DATABASE_HOST',
            'DATABASE_NAME',
            'DATABASE_USER',
            // 'DATABASE_PASS',
        ]);

        if (Array.isArray(checks) && checks.length > 0) {
            logger.critical(`ENV vars ${checks.join(', ')} has to be set`, {_srcId: 'mysql_constructor'});
        }
    }

    async  connect() {}

    query(sql: string) {

    }

    async findOne(table: string, where: Object, columns: string[] = [], maximumDepth: number, relation: RelationI = { name: '', tableName: '', relations: {} } ): Promise<any> {

    }

    async findBy(table: string, where: Object, columns: string[] = [], maximumDepth: number, relation: RelationI = { name: '', tableName: '', relations: {} } ): Promise<any> {

    }

    async findOneBy(table: string, where: Object, columns: string[] = [], maximumDepth: number, relation: RelationI = { name: '', tableName: '', relations: {} } ): Promise<any> {

    }

    async customQuery(sql: string, params: SQL_QUERY_PARAMS): Promise<any> {

    }

    async remove(table: string, where: Object): Promise<any> {
    }

    async insert(table: string, values: Object): Promise<any> {
    }

    async update(table: string, values: Object, where: Object): Promise<any> {
    }

    async delete(table: string, where: Object): Promise<Object> {

        return {};
    }

    addPrePersistEvent(key: string, callback: Function) {

    }

    addPostPersistEvent(key: string, callback: Function) {

    }

    async save(model: BaseModel) {

    }

    addPreDeleteEvent(key: string, callback: Function) {

    }

    addPostDeleteEvent(key: string, callback: Function) {

    }
}