import { RelationI } from './RelationsI';

export default interface Database {
    db: any;
    connect(): void;
    query(sql: string): any;
    findOne(table: string, where: Object, columns: string[], maximumDepth: number, relation: RelationI): Promise<any>;
    findBy(table: string, where: Object, columns: string[], maximumDepth: number, relation: RelationI): Promise<any>;
    remove(table: string, where: Object): Promise<any>;
}