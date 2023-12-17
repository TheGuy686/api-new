export interface RelationRefI {
    type: string;
    name: string;
    joinOn?: string[];
    column: string;
    foreignKey?: string;
    owner?: string;
    relation?: string;
    table?: string;
    direction?: string;
}

export interface RelationI {
   name: string;
   tableName: string;
   relations: { [key: string]: RelationRefI };
}