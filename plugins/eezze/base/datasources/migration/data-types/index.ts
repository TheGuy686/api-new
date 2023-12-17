interface typesI {
    [key: string]: string;
}

/**
 * TypeORM Column Datatypes:
 * https://orkhan.gitbook.io/typeorm/docs/entities#column-types
 *
 */
export const MYSQL_DATA_TYPES: typesI = {
    bit: "",
    int: "number",
    integer: "",
    tinyint: "",
    smallint: "",
    mediumint: "",
    bigint: "",
    float: "",
    double: "",
    dec: "",
    decimal: "",
    numeric: "",
    fixed: "",
    bool: "",
    boolean: "",
    date: "",
    datetime: "datetime",
    timestamp: "",
    time: "",
    year: "",
    char: "",
    nchar: "",
    varchar: "string",
    nvarchar: "string",
    text: "",
    tinytext: "",
    mediumtext: "",
    blob: "",
    longtext: "",
    tinyblob: "",
    mediumblob: "",
    longblob: "",
    enum: "",
    set: "",
    json: "json",
    binary: "",
    varbinary: "",
    geometry: "",
    point: "",
    linestring: "",
    polygon: "",
    multipoint: "",
    multilinestring: "",
    multipolygon: "",
    geometrycollection: ""
};

export const MYSQL_RELATIONSHIP_TYPES: typesI = {
    "many-to-one": "many-to-one",
    "many-to-many": "many-to-many",
    "one-to-many": "one-to-many",
    "one-to-one": "one-to-one"
}