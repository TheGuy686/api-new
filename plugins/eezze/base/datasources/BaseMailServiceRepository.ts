import Logger from '../../classes/Logger';
import Datasource from './';
import BaseModel from '../models/BaseModel';

export default class BaseMailServiceRepository {
	public _srcId: string = '_repo';
    protected model: BaseModel;

	static logger: Logger;
	static ds: Datasource;
	static group: string;
	static table: string;

	static async sendMail(message: any) : Promise<Object> {
        return await this.ds.source.sendMail(message);
    }
}