import { InsertUpdateRowI } from '../interfaces/InsertUpdateRowI';
import { RowDataPacket } from 'mysql2/promise';

export class InsertedRow {
    static parse(type: string, results: RowDataPacket) : InsertUpdateRowI {
        switch (type) {
            case 'mysql':

                const res = results[0];

                return {
                    success: true,
                    lastInsertId: res.insertId
                } as InsertUpdateRowI;

            default: return {
                success: false,
                data: results[0][0],
                lastInsertId: null
            } as InsertUpdateRowI;
        }
    }
}

export class UpdatedRow {
    static parse(type: string, results: RowDataPacket) : InsertUpdateRowI {
        switch (type) {
            case 'mysql':

                const res = results[0];

                return {
                    success: true,
                    lastInsertId: res.insertId
                } as InsertUpdateRowI;

                default: return {
                    success: false,
                    data: results[0][0],
                    lastInsertId: null
                } as InsertUpdateRowI;
        }
    }
}

export class DeleteResult {
    static parse(type: string, results: RowDataPacket) : Object {
        switch (type) {
            case 'mysql': return results[0];

            default: return results[0];
        }
    }
}

export class SingleRow {
    static parse(type: string, results: RowDataPacket) : Object {
        switch (type) {
            case 'mysql': return results[0][0];

            default: return results[0][0];
        }
    }
}

export class MultipleRows {
    static parse(type: string, results: RowDataPacket) : Object[] {
        switch (type) {
            case 'mysql': return results[0];

            default: return results[0];
        }
    }
}