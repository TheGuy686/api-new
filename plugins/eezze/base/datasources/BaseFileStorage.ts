import { ReadFileI } from '../../libs/FileMethods';
import Logger from '../../classes/Logger';
import Datasource from './';

export default class BaseFileStorage {
	public _srcId: string = '_base_file_storage_repo';
    protected static model: any;

	static logger: Logger;
	static ds: Datasource;

    static readFile(path?: string) {
        return this.ds.source.readFile(path);
    }

	static saveFile(params: ReadFileI) : any {
        return this.ds.source.save(params?.path, params.file, params.content);
    }

    static deleteFile(path: string) : boolean {return this.ds.source.delete(path)}

    static fileExists(readFileVars?: object): boolean {return this.ds.source.fileExists(readFileVars)}

    static save(data: any, readFileVars?: object) {
        return this.ds.source.save(data, null, readFileVars);
    }

    static saveFolder(data: any, readFileVars?: object) {
        return this.ds.source.saveFolder(data, readFileVars);
    }

    static removeFolder(data: any, readFileVars?: object) {
        return this.ds.source.removeFolder(data, readFileVars);
    }

    static setFileName(data: any) {
        return this.ds.source.fileName = data;
    }
}