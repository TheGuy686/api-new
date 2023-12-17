
import Logger from '../classes/Logger';
import DatabaseSource from './datasources';
import BaseModel from './models/BaseModel';
import PDC from '../classes/ProjectDependancyCaches';
import { ActionDataManager } from '../classes';

export default class BaseRepository {
	static logger: Logger;
	static ds: DatabaseSource;
    public _srcId: string = '_repo';
    protected model: BaseModel;

	static group: string;
	static table: string;

	static async findOne(where: Object, columns: string[] = [], maximumDepth: number = 4) : Promise<Object> {
        return await this.ds.db.findOne(this.table, where, columns, maximumDepth, PDC.getRelationsByTableName(this.table));
    }

    static async findBy(where: Object = {}, columns: string[] = [], maximumDepth: number = 4) : Promise<Object> {
        return await this.ds.db.findBy(this.table, where, columns, maximumDepth, PDC.getRelationsByTableName(this.table));
    }

    static async findOneBy(where: Object, columns: string[] = [], maximumDepth: number = 4) : Promise<Object> {
        return await this.ds.db.findOneBy(this.table, where, columns, maximumDepth, PDC.getRelationsByTableName(this.table));
    }

    static async query(sql: string, params: SQL_QUERY_PARAMS) : Promise<Object> {
        return await this.ds.db.customQuery(sql, params);
    }

    static async delete(where: Object = {}) : Promise<Object> {
        return await this.ds.db.delete(this.table, where);
    }

    static async insert(values: any) : Promise<Object> {
        return await this.ds.db.insert(this.table, values);
    }

    static async update(values: any, where: Object) : Promise<Object> {
        return await this.ds.db.update(this.table, values, where);
    }

    // readFileVars is only relevant for file storage, but property is added here for interface consistency
    static async save(model: BaseModel, updateProps: any, isCreate: boolean = false, decArgs: any = {}, readFileVars?: object, adm?: ActionDataManager, isReplace: boolean = false,) {
		return this.ds.db.save(this.table, model, updateProps, isCreate, decArgs, adm, isReplace);
	}

    static async remove(model: BaseModel) : Promise<Object> {
        return await this.ds.db.remove(this.table, model);
    }
}