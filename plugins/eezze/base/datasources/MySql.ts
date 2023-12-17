import Logger from '../../classes/Logger';
import BaseModel from '../models/BaseModel';
import Database from '../../interfaces/DatabaseI';
import { createConnection, RowDataPacket } from 'mysql2/promise';

import { MultipleRows, InsertedRow, DeleteResult } from '../../libs/DatabaseResults';
import { isPromise } from '../../libs/ObjectMethods';
import { ActionDataManager } from '../../classes';

import PDC from '../../classes/ProjectDependancyCaches';
import { RelationRefI } from '../../interfaces/RelationsI';
import { underscoreCase } from '../../libs/StringMethods';
import { RelationI } from '../../interfaces/RelationsI';
import { pluralize, camelCase, pascalCase } from '../../libs/StringMethods';

interface MysqlParamI {
    host: string;
    database: string;
    user: string;
    password: string;
    includeDatabase: boolean;
}

export default class MySql implements Database {
    logger: Logger;
    db: any;
    _srcId: string = '_mysqldb';

    private connectionParams: any = {};

    includeDatabase: boolean = false;
    isConnected: boolean = false;
    prePersistEvents: any = {};
    postPersistEvents: any = {};
    preDeleteEvents: any = {};
    postDeleteEvents: any = {};

    constructor(args: MysqlParamI, logger: Logger) {
        this.logger = logger;

        this.includeDatabase = args?.includeDatabase ?? true;

        this.connectionParams = {
            host: args.host,
            database: args.database,
            user: args.user,
            password: args.password,
        };
    }

    async connect() {
        this.db = await createConnection(
            {
                host: this.connectionParams.host,
                database: this.connectionParams.database,
                user: this.connectionParams.user,
                password: this.connectionParams.password,
                port: this.connectionParams?.port ?? 3306,
            }
        );

        this.isConnected = true;

        this.logger.successI('MySql db successfully connected', this);
    }

    async connectIfNot() {
        if (!this.isConnected) {
            await this.connect();
        }
    }

    /**
     * Avoids errors such as these:
     * `Can't add new command when connection is in closed state`
     *
     * Close connection after each query.
     */
    private closeConnection() {
        if (this.isConnected) {
            this.db.end();
            this.isConnected = false;
        }
    }

    async startTransaction() {
        if (this.isConnected) {
            await this.db.query('START TRANSACTION');
            this.logger.debugI(`MySql:transaction:started`, this);
        }
    }

    async endTransaction() {
        if (this.isConnected) {
            await this.db.query('COMMIT');
            this.logger.debugI(`MySql:transaction:ended`, this);

            this.closeConnection();
        }
    }

    async transactionRollback() {
        if (this.isConnected) {
            this.db.rollback(function () {
                this.db.release();
            });
        }
    }

    private getInsertParamMarks(values: Object) {
        const marks: string[] = [];

        Object.keys(values).forEach(() => marks.push('?'));

        return marks.join(', ');
    }

    /**
     * Return table name from an Eezze model name.
     *
     * @param modelName Eezze model name
     * @returns
     */
    private getTableName(modelName: string): string {
        return PDC.getTableName(modelName);
    }

    private convertToWhereQuery(where: Object, table: string) {
        // expected syntax:
        // [
        //      These keys will be (key = ? AND key2 = ?)
        //      { username: 'Username' },
        //      Then linked by an "OR" and the same again
        //      {email: 'example@gmail.com'}
        // ]
        if (Array.isArray(where)) {
            const sqlAndParams: any[] = [], sqlOrParams: any[] = [];

            // loop over outter where
            for (const k in where) {
                const inAndParams: string[] = [];
                // then loop over
                for (const ik in where[k]) {
                    inAndParams.push(`${table}.\`${ik}\` = ?`);
                }

                sqlAndParams.push(`(${inAndParams.join(' OR ')})`)
            }

            return sqlAndParams.join(' OR ');
        }

        const sqlParams: string[] = [];

        Object.keys(where).forEach((key) => sqlParams.push(`${table}.\`${key}\` = ?`));

        return sqlParams.join(' AND ');
    }

    private getWhereValues(where: Object, table: string) {
        let out: any[] = [];

        // [[{...}]]

        if (Array.isArray(where)) {
            const sqlAndParams: any[] = [], sqlOrParams: any[] = [];

            try {
                // loop over outter where
                for (const k in where) {
                    // then loop over inner where params
                    for (const ik in where[k]) {
                        out = [...out, ...(Object.values(where[k]))];
                    }
                }
            }
            catch (e) {
                console.log('ERROR->Could not convert where values in Mysql:getWhereValues: ', e.message, ' : ', where);
            }
        }
        else {
            out = Object.values(where);
        }

        return out;
    }

    /**
     * Convert column names in string format: `model.column` to 'table.column'
     *
     * return as comma separated string
     *
     * @param columns string[]
     */
    private convertColumnNames(columns: string[]) {
        for (let index = 0; index < columns.length; index++) {
            const element = columns[index];
            const modelName = element.slice(0, element.lastIndexOf('.'));
            const columnName = element.slice(element.lastIndexOf('.') + 1, element.length);
            const tableName = this.getTableName(modelName);

            columns[index] = `${tableName}.\`${columnName}\` AS \`${modelName}_${columnName}\``;
        }

        return columns.join(', ');
    }

    private convertvaluesToUpdateQuery(values: Object) {
        const updateValues: string[] = [];

        Object.keys(values).forEach((key) => {
            updateValues.push(`\`${key}\` = ?`)
        });

        return updateValues.join(', ');
    }

    async query(sql: string, queryParams: any[] = []): Promise<RowDataPacket | RowDataPacket[]> {
        await this.connectIfNot();

        const [rows] = await this.db.query(sql, queryParams);

        this.closeConnection();

        return [rows];
    }

    async customQuery(sql: string, params: SQL_QUERY_PARAMS) : Promise<any> {
        await this.connectIfNot();

        this.logger.debugI(`MySql:customQuery: RUNNING CUSTOM QUERY: ${sql}`, this);

        const results = MultipleRows.parse('mysql', await this.db.query(sql, params));

        this.closeConnection();

        return results;
    }

    async delete(table: string, where: Object): Promise<Object> {
        await this.connectIfNot();

        const sql = `
           DELETE
             FROM ${table}
            WHERE ${this.convertToWhereQuery(where, table)}
            LIMIT 1
        `;

        this.logger.debugI(`MySql:remove: RUNNING QUERY: ${sql}: With values: [${Object.values(where).join(', ')}]`, this);

        const res = await this.query(sql, Object.values(where)) as RowDataPacket;

        return DeleteResult.parse('mysql', res);
    }

    async findOne(table: string, where: Object, columns: string[] = [], maximumDepth: number = 4, relation: RelationI = { name: '', tableName: '', relations: {} }): Promise<Object> {
        return this.findOneBy(table, where, columns, maximumDepth, relation);
    }

    /**
     * Returns an alias that is guaranteed not used.
     * 
     * @param tableAliases list of all table aliases
     * @param tableName table name
     * @returns 
     */
    private getTableAlias(tableAliases: string[], tableName: string): string {
        if (tableAliases.includes(tableName)) {
            return this.getTableAlias(tableAliases, tableName.charAt(0) + tableName);
        }
        
        return tableName;
    }

    /**
     * @todo Join type; LEFT, INNER JOIN should be determined by required 0, 1.
     *
     * @param table
     * @param where
     * @param columns
     * @param queryTree
     * @returns
     */
    private getQuery(table: string, where: Object, columns: string[] = [], queryTree: any): string {
        const fromSql = `FROM ${table} ${table}`;
        const tableAliases: string[] = [];

        let sql;

        if (typeof queryTree[0] === 'object' && Object.keys(queryTree[0]).length > 0) {
            let joinSql = '';

            for (const depth in queryTree) {
                const relations = queryTree[depth];

                for (const bindProp in relations) {
                    const rel = relations[bindProp] as RelationRefI;
                    const tableName = this.getTableName(rel.name);
                    let tableAlias = '';

                    // in case there's a join on two or more properties of the same table
                    if (rel.type) {
                        tableAlias = this.getTableAlias(tableAliases, tableName);
                        tableAliases.push(tableAlias);
                    }

                    if (rel.type === 'OneToOne') {
                        const joinColumnsSql = [];

                        for (const col of rel.joinOn) {
                            if (typeof rel.foreignKey !== 'undefined') {
                                joinColumnsSql.push(`${rel.table}.\`${col}\` = ${tableAlias}.\`${rel.foreignKey}\``);
                            }
                            else {
                                joinColumnsSql.push(`${rel.table}.\`${rel.column}\` = ${tableAlias}.\`${col}\``);
                            }
                        }

                        const join = `\n LEFT JOIN ${underscoreCase(tableName)} AS ${tableAlias} ON ${joinColumnsSql.join(' ON ')}`;

                        joinSql += join;
                    }

                    if (rel.type === 'OneToMany') {
                        const mtoJoinColumnsSql = [];

                        for (const col of rel.joinOn) {
                            if (typeof rel.foreignKey !== 'undefined') {
                                mtoJoinColumnsSql.push(`${rel.table}.\`${col}\` = ${tableAlias}.\`${rel.foreignKey}\``);
                            }
                            else {
                                mtoJoinColumnsSql.push(`${rel.table}.\`${rel.column}\` = ${tableAlias}.\`${col}\``);
                            }
                        }

                        const join = `\n LEFT JOIN ${underscoreCase(tableName)} AS ${tableAlias} ON ${mtoJoinColumnsSql.join(' ON ')}`;
                        joinSql += join;
                    }

                    if (rel.type === 'ManyToOne') {
                        const mtoJoinColumnsSql = [];

                        for (const col of rel.joinOn) {
                            if (typeof rel.foreignKey !== 'undefined') {
                                mtoJoinColumnsSql.push(`${rel.table}.\`${col}\` = ${tableAlias}.\`${rel.foreignKey}\``);
                            }
                            else {
                                mtoJoinColumnsSql.push(`${rel.table}.\`${rel.column}\` = ${tableAlias}.\`${col}\``);
                            }
                        }

                        const join = `\n LEFT JOIN ${underscoreCase(tableName)} AS ${tableAlias} ON ${mtoJoinColumnsSql.join(' ON ')}`
                        joinSql += join;
                    }

                    if (rel.type === 'ManyToMany') {
                        // create join table name
                        let joinTableName: string;

                        if (rel.owner !== rel.table) {
                            joinTableName = `${rel.owner}_${pluralize(rel.table)}_${rel.table}`;
                        }
                        else {
                            joinTableName = `${rel.owner}_${pluralize(tableName)}_${tableName}`;
                        }

                        // create joins
                        const joinA = `\n LEFT JOIN ${joinTableName} ON ${rel.table}.\`${rel.column}\` = ${joinTableName}.\`${rel.table}${pascalCase(rel.column)}\``;
                        const joinB = `\n LEFT JOIN ${underscoreCase(tableName)} ${tableName} ON ${tableName}.\`${rel.column}\` = ${joinTableName}.\`${tableName}${pascalCase(rel.column)}\``;

                        joinSql += joinA;
                        joinSql += joinB;
                    }
                }
            }

            if (Object.keys(where).length > 0) {
                sql = `
                    SELECT  ${columns.length > 0 ? this.convertColumnNames(columns) : '*'}
                            ${fromSql}
                            ${joinSql}
                    WHERE   ${this.convertToWhereQuery(where, table)}
                `;
            }
            else {
                sql = `
                    SELECT  ${columns.length > 0 ? this.convertColumnNames(columns) : '*'}
                            ${fromSql}
                            ${joinSql}
            `;
            }
        }
        else {
            if (Object.keys(where).length > 0) {
                sql = `
                    SELECT ${columns.length > 0 ? columns.join(', ') : '*'}
                    FROM ${table} ${table}
                    WHERE ${this.convertToWhereQuery(where, table)}
                `;
            }
            else {
                sql = `
                    SELECT ${columns.length > 0 ? columns.join(', ') : '*'}
                    FROM ${table} ${table}
                `;
            }
        }

        return sql;
    }

    async findBy(table: string, where: Object = {}, columns: string[] = [], maximumDepth: number = 4, relation: RelationI = { name: '', tableName: '', relations: {} }): Promise<Object> {
        // the same implementation as findOneBy, return directly
        return this.findOneBy(table, where, columns, maximumDepth, relation);
    }

    async findOneBy(table: string, where: Object, columns: string[] = [], maximumDepth: number = 4, relation: RelationI = { name: '', tableName: '', relations: {} }): Promise<Object> {
        await this.connectIfNot();

        const currentDepth: number = 0;

        const queryTree = this.getQueryTree(relation.name, relation, maximumDepth, currentDepth);
        if (columns.length === 0) columns = this.getColumns(relation.name, queryTree);

        const tree = Object.keys(queryTree).length > 0 ? queryTree : relation.name;

        const sql = this.getQuery(table, where, columns, tree);

        const whereValues: any = this.getWhereValues(where, table);

        this.logger.debugI(`MySql:findOneBy: RUNNING QUERY: ${sql}: With values: [${whereValues}]`, this);

        const results = MultipleRows.parse('mysql', await this.db.query(sql, whereValues));

        this.closeConnection();

        return results;
    }

    /**
     *
     * @param relationName
     * @param queryTree
     * @returns
     */
    private getColumns(relationName: string, queryTree: { [key: string]: { [key: string]: {} } }): string[] {
        const columns = new Set(); // use a Set to automaticaly ignore duplicate strings getting added.

        // 1. loop over the query tree, if any.
        if (Object.keys(queryTree).length > 0) {
            for (const index in queryTree) {
                for (const entity in queryTree[index]) {
                    const entityObj: any = queryTree[index][entity];

                    if (index !== '0') {
                        relationName = entityObj.name;
                    }

                    const entityProperties = PDC.getEntityProps(relationName);

                    // 2. loop over the individual properties of the model, and rename.
                    for (const col in entityProperties) {
                        const columnObj = entityProperties[col];

                        if (columnObj.isEntity) {
                            const subEntityProperties = PDC.getEntityProps(columnObj.type);

                            for (const subCol in subEntityProperties) {
                                const subColumnObj = subEntityProperties[subCol];

                                if (subColumnObj.isTransient) continue;

                                if (!subColumnObj.isEntity) columns.add(`${columnObj.type}.${subColumnObj.name}`);
                            }
                        }
                        else if (columnObj.isTransient) {
                            continue;
                        }
                        else {
                            columns.add(`${relationName}.${columnObj.name}`);
                        }
                    }
                }
            }
        }
        else {
             // 3. in case there's no query tree, just add main relation columns.
            const entityProperties = PDC.getEntityProps(relationName);
            const tableNameRelation = PDC.getTableName(relationName);

            for (const col in entityProperties) {
                const columnObj = entityProperties[col];

                if (columnObj.isTransient) continue;

                if (!columnObj.isEntity) {
                    columns.add(`${tableNameRelation}.${columnObj.name}`);
                }
            }
        }

        return Array.from(columns) as string[];
    }

    /**
     * Construct the relationship tree from the intitial `table`. This tree is used to create the SQL query that captures all the relationships.
     *
     * This function will call itself recursively to create the relationship tree updating the table, relation and currentDepth properties.
     *
     * It will stop once the maximum depth has been reached.
     *
     * 'OrderTableModel': {
            name: 'OrderTableModel',
            relations: {
                'createdBy': {
                    type: 'OneToOne',
                    name: 'UserModel',
                    joinAttributes: [ 'userId' ]
                }
            }
        }
     *
     * @param relation relationships of the `table`
     * @param maximumDepth maximum relationship depth from the initial `table`
     * @param currentDepth current relationship depth from the initial `table`
     */
    private getQueryTree(initialModel: string, relation: RelationI, maximumDepth: number, currentDepth: number, tree: { [key: string]: { [key: string]: any } } = {}): { [key: string]: { [key: string]: {} } } {
        if (typeof tree[currentDepth] === 'undefined') tree[currentDepth] = {};

        if (Object.keys(relation.relations).length > 0) {
            const propertyArray = Object.keys(relation.relations);

            for (let index = 0; index < propertyArray.length; index++) {
                const element = relation.relations[propertyArray[index]];
                const property = propertyArray[index];
                const modelName = element.name;

                if (PDC.relationHasChildren(modelName) && currentDepth < maximumDepth) {
                    let skipThisModel = false;

                    // 1. if there's a relationship from the initial model with the child model, we need to ignore the reverse relationship.
                    if (currentDepth === 1 && initialModel === modelName) continue;

                    // 2. filter out other reverse relationships
                    if (currentDepth > 1) {
                        const lookBackDepth = currentDepth - 2;
                        const previousTreeProperties = Object.keys(tree[lookBackDepth]);

                        for (const previousProperty of previousTreeProperties) {
                            const previousItem: any = tree[lookBackDepth][previousProperty];

                            if (modelName === previousItem.name) {
                                skipThisModel = true;
                            }
                        }
                    }

                    if (!skipThisModel) {
                        // 3. it's a unique relationship, record details and table name owning the relationship
                        tree[currentDepth][property] = relation.relations[property];
                        tree[currentDepth][property].table = this.getTableName(relation.name);
                        this.getQueryTree(initialModel, PDC.relation(modelName), maximumDepth, currentDepth + 1, tree);
                    }
                }
            }
        }

        if (Object.keys(tree[currentDepth]).length === 0) delete tree[currentDepth];

        return tree;
    }

    private generateInsertStatements(values: object[], replace: boolean): any[] {
        const statements: any[] = [];
        const mtmStatements: any[] = [];
        const operation = replace ? 'REPLACE' : 'INSERT';

        for (let index = 0; index < values.length; index++) {
            const element: any = values[index];
            const modelNameAndOccurrence = Object.keys(element)[0]; // SomeModel_1, SomeModel_2
            const modelName = modelNameAndOccurrence.slice(0, modelNameAndOccurrence.indexOf('_'));
            const occurrence = modelNameAndOccurrence.slice(modelNameAndOccurrence.indexOf('_') + 1, modelNameAndOccurrence.length);
            const tableName = PDC.getTableName(modelName);
            const value = element[modelNameAndOccurrence];
            const relationships = typeof value.RELATIONSHIPS === 'object' ? { ...value.RELATIONSHIPS } : undefined;
            const childRelationships = typeof value.CHILD_RELATIONSHIPS === 'object' ? { ...value.CHILD_RELATIONSHIPS } : undefined;

            const foreignKeysUsedBy: string[] = [];
            const foreignKeys: string[] = [];
            const relationshipArray: string[] = [];

            delete value.RELATIONSHIPS;
            delete value.CHILD_RELATIONSHIPS;

            if (relationships) {
                for (const modelName of Object.keys(relationships)) {
                    for (const relationTypeName of Object.keys(relationships[modelName])) {
                        const relationData = relationships[modelName][relationTypeName];

                        if (relationData.type !== 'OneToMany' && relationData.column) {
                            foreignKeys.push(relationData.table + ':' + relationData.column);
                            relationshipArray.push(relationData.type);
                        }

                        if (relationData.type === 'OneToMany' || relationData.type === 'ManyToMany') {
                            foreignKeysUsedBy.push(relationData.table);
                        }

                        // set foreign keys if they've not been set.
                        if (relationData.type === 'ManyToOne') {
                            if (typeof value[relationData.column] === 'undefined') value[relationData.column] = 0;
                        }
                    }
                }
            }

            if (childRelationships) {
                for (const modelNameTitle of Object.keys(childRelationships)) {
                    const childTableName = PDC.getTableName(modelNameTitle);
                    foreignKeysUsedBy.push(childTableName);

                    for (const childRelationTypeName of Object.keys(childRelationships[modelNameTitle])) {
                        const childRelationData = childRelationships[modelNameTitle][childRelationTypeName];

                        if (childRelationData.type === 'ManyToOne' && childRelationData.column) {
                            foreignKeys.push(childRelationData.table + ':' + childRelationData.column);
                            relationshipArray.push(childRelationData.type);
                        }

                        if (childRelationData.type === 'ManyToMany') {
                            let table;
                            const ownerTable = childRelationData.owner;

                            if (childRelationData.owner !== childRelationData.table) {
                                table = childRelationData.table;
                            }
                            else {
                                table = tableName;
                            }

                            const joinTableName = `${ownerTable}_${pluralize(table)}_${table}`;

                            // for each model property, there's a many to many relationship
                            // insert logic uses index matching, hence in relationships duplicate values.
                            mtmStatements.push({
                                query: `INSERT INTO ${joinTableName} (${table}Id, ${ownerTable}Id)
                                        VALUES (?, ?)`,
                                values: { [`\`${table}Id\``]: 0, [`\`${ownerTable}Id\``]: 0 },
                                foreignKeysUsedBy: [ownerTable, table],
                                foreignKeys: [`\`${table}:${table}Id\``, `\`${ownerTable}:${ownerTable}Id\``],
                                occurrence,
                                occurrenceOnTable: tableName,
                                relationships: [childRelationData.type, childRelationData.type]
                            });
                        }
                    }
                }
            }

            statements.push({
                query: `${operation} INTO ${tableName} (\`${Object.keys(value).join('\`, \`')}\`)
                        VALUES (${this.getInsertParamMarks(value)})`,
                values: value,
                table: tableName,
                modelName,
                foreignKeysUsedBy,
                foreignKeys,
                occurrence,
                relationships: relationshipArray
            });
        }

        return statements.concat(mtmStatements);
    }

    async replace(table: string, values: any) {
        return this.insert(table, values, true);
    }

    async insert(table: string, values: any, replace: boolean = false) {
        const insertStatements = this.generateInsertStatements(values, replace);
        const results: any[] = [];
        const fk: any[] = [];

        await this.connectIfNot();

        // start transaction
        await this.startTransaction();

        for (let index = 0; index < insertStatements.length; index++) {
            const statement = insertStatements[index];
            let fkTable, foreignKey;

            if (statement.foreignKeys.length > 0) {
                for (let index = 0; index < statement.foreignKeys.length; index++) {
                    const fkString = statement.foreignKeys[index];
                    fkTable = fkString.slice(0, fkString.indexOf(':'));
                    foreignKey = fkString.slice(fkString.indexOf(':') + 1, fkString.length);

                    for (const fkInserted of fk) {
                        // At least a table name match in the foreignKey list
                        if (fkInserted.table === fkTable && typeof statement.values[foreignKey] !== 'undefined') {
                            // ManyToOne case
                            if (typeof statement.relationships[index] !== 'undefined'
                                && statement.relationships[index] === 'ManyToOne') {
                                statement.values[foreignKey] = fkInserted.foreignKey
                                continue; // first found, move on.
                            }

                            // ManyToMany case, needs to match with 2 foreign keys.
                            if (typeof statement.relationships[index] !== 'undefined'
                                && statement.relationships[index] === 'ManyToMany') {
                                // match the occurrence of the occurrenceOnTable table.
                                if (statement.occurrenceOnTable === fkTable
                                    && statement.occurrence === fkInserted.occurrence) {
                                    statement.values[foreignKey] = fkInserted.foreignKey
                                    continue
                                }
                                else if (statement.occurrenceOnTable !== fkTable) {
                                    statement.values[foreignKey] = fkInserted.foreignKey
                                    continue
                                }
                            }

                            // Match foreign key and occurrence (general case)
                            if (fkInserted.occurrence === statement.occurrence) {
                                statement.values[foreignKey] = fkInserted.foreignKey
                                continue; // first found, move on.
                            }
                        }
                    }
                }
            }

            this.logger.debugI(`MySql:insert: RUNNING QUERY: ${statement.query}: With values: [${Object.values(statement.values).join(', ')}]`, this);

            const result = InsertedRow.parse('mysql', await this.db.query(statement.query, Object.values(statement.values)));

            if (result.success && result.lastInsertId && statement.table) {
                fk.push({ table: statement.table, foreignKey: result.lastInsertId, occurrence: statement.occurrence });
            }

            result.table = statement.table;

            results.push(result);
        }

        // end transaction
        await this.endTransaction();

        return results;
    }

    async update(table: string, values: Object, where: Object) {
        await this.connectIfNot();

        const sql = `
          UPDATE ${table}
             SET ${this.convertvaluesToUpdateQuery(values)}
           WHERE ${this.convertToWhereQuery(where, table)}
        `;

        this.logger.debugI(`MySql:update: RUNNING QUERY: ${sql}: With values: [${Object.values(values).join(', ')}]`, this);

        return InsertedRow.parse(
            'mysql',
            await this.db.query(
                sql,
                Object.values(values).concat(Object.values(where))
            )
        );
    }

    async save(
        table: any,
        model: any,
        updateProps: any,
        isCreate: boolean = false,
        decArgs: any = {},
        adm?: ActionDataManager,
        isReplace: boolean = false
    ) : Promise<{ newMdl: BaseModel, oldMdl: BaseModel }> {
        // first we need to check if there is a pre persis event mapped to this model and then run it first
        if (model.__id && typeof this.prePersistEvents[model.__id] == 'function') {
            await this.prePersistEvents[model.__id]();
        }

        let res, where, results, one: any, old: any;

        // Inserting entity
        if (isCreate) {
            if (updateProps && Object.keys(updateProps).length > 0) {
                model.updateNonWhereProps(updateProps);
            }

            // serialize the data, then we need to split that data by model before we insert it.
            const serializedData = isPromise(model.serialize) ? await model.serialize(true, true, adm) : model.serialize(true, true, adm);
            const modelData = model.getInsertUpdateStructureModel(serializedData);
            const sortedModels = model.sortModels(modelData);

            results = await this.insert(
                table as string,
                sortedModels
            );

            // then we need to get the keys to try and identify if or not that this is a single autoincrementing key
            const whereKeys = BaseModel._getUIDKeys(model);

            for (const res of results) {
                // find the base table and set the Identifier, so we can return the base object.
                if (Object.keys(whereKeys).length == 1 && res.lastInsertId != null && res.table === table) {
                    where = {
                        [Object.values(whereKeys)[0]]: res.lastInsertId,
                    };
                }
                // here we just assume that everything was successful and then return it without the UID set on the model
                // else return model.serialize(false, false, adm);
            }
        }
        else if (isReplace) {
            // serialize the data, then we need to split that data by model before we insert it.
            const serializedData = isPromise(model.serialize) ? await model.serialize(true, true, adm) : model.serialize(true, true, adm);
            const modelData = model.getInsertUpdateStructureModel(serializedData, isReplace);
            const orderedModelData = model.sortModels(modelData);

            results = await this.replace(
                table as string,
                orderedModelData
            );

            // then we need to get the keys to try and identify if or not that this is a single autoincrementing key
            const whereKeys = BaseModel._getUIDKeys(model);

            for (const res of results) {
                // this should be in the case that there is one id column and most likely an autoincrementer id
                if (Object.keys(whereKeys).length == 1 && res.lastInsertId != null) {
                    where = {
                        [Object.values(whereKeys)[0]]: res.lastInsertId,
                    };
                }
                // here we just assume that everything was successful and then return it without the UID set on the model
                else return model.serialize(false, true, adm);
            }
        }
        // Updating entity
        else {
            where = BaseModel._getUID(model);

            if (Object.keys(where).length == 0) {
                this.logger.critical(
                    `Mysql:save:_getUID - There were no UID keys defined. Please use the @UID decorator to use this feature.`,
                    { _srcId: 'mysql_save:update' }
                );
            }

            try {
                // updates limited to 0 maximum depth
                const maximumDepth: number = 0;

                one = await this.findOneBy(table as string, where, [], maximumDepth, PDC.getRelationsByTableName(table as string));

                // because of possible relationships, multple records can be returned. Get the first record.
                if (Array.isArray(one)) one = one[0];

                if (!one) throw new Error('There was no entity existing with those credentials');

                one = new model.constructor(one);
            }
            catch (e) {
                console.log('\nError: ', e?.message ?? e);

                return {
                    success: false,
                    error: 'No entities existed with those credentials',
                } as any;
            }

            old = await new model.constructor(one, true).serialize(false, false, adm)

            if (updateProps && Object.keys(updateProps).length > 0) {
                one.updateNonWhereProps(updateProps);
            }

            const serializedData = isPromise(one.serialize) ? await one.serialize(true, true, adm) : one.serialize(true, true, adm);
            const cleanedData = model.cleanUpdateData(serializedData);

            results = await this.update(
                table as string,
                cleanedData,
                where
            );
        }

        // here we need to run the pose persist events if they exist
        if (model.__id &&  typeof this.postPersistEvents[model.__id] == 'function') {
            await this.postPersistEvents[model.__id]();
        }

        // ensure we get the base table results returned.
        const maximumDepth: number = 0;

        one = await this.findOne(table, where, [], maximumDepth, PDC.getRelationsByTableName(table));

        if (Array.isArray(one)) one = one[0];

        // lastly we need query the inserted / updated entry to return all columns from the database
        return {
            newMdl: await new model.constructor(one, true).serialize(false, false, adm),
            oldMdl: old,
        }
    }

    async remove(table: any, model: BaseModel) : Promise<Object> {
        // first we need to check if there is a pre remove event mapped to this model and then run it first
        if (model.__id && typeof this.preDeleteEvents[model.__id] == 'function') {
            await this.preDeleteEvents[model.__id]();
        }

        // then we need to get the keys to try and identify if or not that this is a single autoincrementing key
        const where = BaseModel._getUID(model);

        // ,if there is no UID's defined then we need to critical as the model is not propertly defined
        if (Object.keys(where).length == 0) {
            this.logger.critical(
                `Mysql:remove:_getUID - There were no UID keys defined. Please use the @UID decorator to use this feature.`,
                { _srcId: 'mysql_save:remove' },
            );
        }

        let res: any;

        try {
            const maximumDepth: number = 0;
            res = await this.findOne(table, where, [], maximumDepth, PDC.getRelationsByTableName(table));

            if (Array.isArray(res)) res = res[0];

        }
        catch (e) {
            console.log('Mysql:remove:this.delete: ', e);

            return {
                success: false,
                error: 'Entity did not exist with that id',
            };
        }

        try {
            res = await this.delete(table, where);
        }
        catch (e) {
            console.log('Mysql:remove:this.delete: ', e);

            return {
                success: false,
                error: e.message
            };
        }

        if (res.affectedRows == 0) {
            return {
                success: false,
                error: 'Unknown error'
            };
        }

        // here we need to run the post remove events if they exist
        if (model.__id &&  typeof this.postDeleteEvents[model.__id] == 'function') {
            await this.postDeleteEvents[model.__id]();
        }

        return {
            success: true,
            message: 'Successfully deleted'
        };
    }
}