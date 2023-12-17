
export interface InsertUpdateRowI {
    success: boolean;
    lastInsertId: number | string;
    data?: any;
    table?: string;
}