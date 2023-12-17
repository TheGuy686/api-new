import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { DataTransformer, EAction, GetOne } from '@eezze/decorators';
import { pascalCase, pluralize, underscoreCase } from '@eezze/libs/StringMethods';
import { LogicChain, datasource } from '@eezze/classes';
import { mkdir, rmdir, writeFile } from '@eezze/libs/FileMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class GenerateMigrationFilesAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		failOnEmpty: true,
	})
	/*
	Example json object:
	{
		'name': 'Post',
		'columns': {
			'id': {
				'primary': true,
				'type': 'int',
				'generated': true
			},
			'title': {
				'type': 'varchar'
			},
			'text': {
				'type': 'text'
			},
			'test': {
				'type': 'varchar'
			}
		},
		'relations': {
			'categories': {
				'target': 'Category',
				'type': 'many-to-many',
				'joinTable': true,
				'cascade': true
			}
		}
	}
	*/
	@DataTransformer({
		output: async (adm: ADM, lc: LogicChain) => {
			// these are taken from TypeORM
			const PrimaryGeneratedColumnTypes = ['int', 'int2', 'int4', 'int8', 'integer', 'tinyint', 'smallint', 'mediumint', 'bigint', 'dec', 'decimal', 'smalldecimal', 'fixed', 'numeric', 'number'];
			const RelationTypes = ['one-to-one', 'one-to-many', 'many-to-one', 'many-to-many'];

			// Columns: type
			type WithLengthColumnType = 'character varying' | 'varying character' | 'char varying' | 'nvarchar' | 'national varchar' | 'character' | 'native character' | 'varchar' | 'char' | 'nchar' | 'national char' | 'varchar2' | 'nvarchar2' | 'alphanum' | 'shorttext' | 'raw' | 'binary' | 'varbinary' | 'string';
			type WithWidthColumnType = 'tinyint' | 'smallint' | 'mediumint' | 'int' | 'bigint';
			type WithPrecisionColumnType = 'float' | 'double' | 'dec' | 'decimal' | 'smalldecimal' | 'fixed' | 'numeric' | 'real' | 'double precision' | 'number' | 'datetime' | 'datetime2' | 'datetimeoffset' | 'time' | 'time with time zone' | 'time without time zone' | 'timestamp' | 'timestamp without time zone' | 'timestamp with time zone' | 'timestamp with local time zone';
			type SimpleColumnType = 'simple-array' | 'simple-json' | 'simple-enum' | 'int2' | 'integer' | 'int4' | 'int8' | 'int64' | 'unsigned big int' | 'float' | 'float4' | 'float8' | 'float64' | 'smallmoney' | 'money' | 'boolean' | 'bool' | 'tinyblob' | 'tinytext' | 'mediumblob' | 'mediumtext' | 'blob' | 'text' | 'ntext' | 'citext' | 'hstore' | 'longblob' | 'longtext' | 'alphanum' | 'shorttext' | 'bytes' | 'bytea' | 'long' | 'raw' | 'long raw' | 'bfile' | 'clob' | 'nclob' | 'image' | 'timetz' | 'timestamptz' | 'timestamp with local time zone' | 'smalldatetime' | 'date' | 'interval year to month' | 'interval day to second' | 'interval' | 'year' | 'seconddate' | 'point' | 'line' | 'lseg' | 'box' | 'circle' | 'path' | 'polygon' | 'geography' | 'geometry' | 'linestring' | 'multipoint' | 'multilinestring' | 'multipolygon' | 'geometrycollection' | 'st_geometry' | 'st_point' | 'int4range' | 'int8range' | 'numrange' | 'tsrange' | 'tstzrange' | 'daterange' | 'enum' | 'set' | 'cidr' | 'inet' | 'macaddr' | 'bit' | 'bit varying' | 'varbit' | 'tsvector' | 'tsquery' | 'uuid' | 'xml' | 'json' | 'jsonb' | 'varbinary' | 'hierarchyid' | 'sql_variant' | 'rowid' | 'urowid' | 'uniqueidentifier' | 'rowversion' | 'array' | 'cube' | 'ltree';
			type ColumnType = WithPrecisionColumnType | WithLengthColumnType | WithWidthColumnType | SimpleColumnType | BooleanConstructor | DateConstructor | NumberConstructor | StringConstructor;

			const DataTypes: { [key: string]: ColumnType } = { 'long-text': 'text', 'number': 'int', 'text': 'varchar' };

			function hasType(modelDataType: string): boolean {
				if (modelDataType as ColumnType) {
					return true;
				}
				throw new Error(`There's no matching datatype for ${modelDataType}`);
			}

			// Relations: type
			type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
			type Column = {
				[key: string]: {
					primary?: boolean; // primary key
					type: ColumnType; // column type, varchar, int, json etc.
					length?: string | number; // length of varchar etc.
					width?: number; // INT with a display width of four digits.
					nullable?: boolean; // allow null
					unique?: boolean;
					generated?: true | 'increment' | 'uuid' | 'rowid'; // identifiers, auto increment
					enum?: any[] | Object; // possible enumerated values
					default?: any;
					/**
					 * If set to 'true' this option disables Sqlite's default behaviour of secretly creating
					 * an integer primary key column named 'rowid' on table creation.
					 * @see https://www.sqlite.org/withoutrowid.html.
					 */
					withoutRowid?: boolean;
				}
			}

			type Relation = {
				[key: string]: {
					target: string; // Model name of the entity this relationship exists with.
					type: RelationType; // relationship type, one-to-many etc.
					primary?: boolean; // primary key,  Can be used only for many-to-one and owner one-to-one relations.
					/**
					 * Indicates whether foreign key constraints will be created for join columns.
					 * Can be used only for many-to-one and owner one-to-one relations.
					 * Defaults to true.
					 */
					createForeignKeyConstraints?: boolean;
					joinTable?: any // For many-to-many relations, has; name property to override generated many to many table.
					nullable?: boolean; // Indicates if relation column value can be nullable or not.
					joinColumn?: boolean | object; // true, indicates owning relationship.OR can optionally override the column naming: { name?: string; referencedColumnName?: string; foreignKeyConstraintName?: string; } 
					inverseSide?: string; // for bi-directional relationships.
				}
			}

			type Output = {
				name: string,
				columns: Column,
				relations?: Relation
			};

			try {
				// clean the directory first.
				// all entities can be removed, it's a per datasource setup.
				const datasourceName = pascalCase(adm.action(0).result.name);
				const entityItems = JSON.parse(adm.input.entities);
				const entitiesOutput: Output[] = [];

				for (const entity in entityItems) {
					const columns = entityItems[entity];

					if (columns.length > 0) {
						const output: Output = { name: pascalCase(entity), columns: {} };

						for (const item of columns) {
							const type = item.dataType.toLowerCase();

							if (typeof item.key !== 'undefined') {
								const keyValues = item.key;

								if (hasType(type)) {
									output.columns[item.columnName] = {
										type
									}
								}
								else throw Error(`Unsupport data type ${type}`);

								if (output.columns[item.columnName]) {
									if (keyValues.primary) {
										output.columns[item.columnName].primary = keyValues.primary;

										if (PrimaryGeneratedColumnTypes.includes(item.dataType.toLowerCase())) {
											output.columns[item.columnName].generated = 'increment';
										}
									}
									if (keyValues.unique) {
										output.columns[item.columnName].unique = keyValues.unique;
									}
									if (item.length) {
										output.columns[item.columnName].length = item.length;
									}
									// if (keyValues['input-default']) {
									// 	output.columns[item.columnName]['default'] = keyValues['input-default'];
									// }
									if (item.allow_null) {
										output.columns[item.columnName].nullable = item.allow_null;
									}
								}

								if (item.relationships) {
									const biDirectionalRelationships: string[] = [];
									const bidirectional: string[] =[]

									for (const relationship of item.relationships) {
										if (biDirectionalRelationships.includes(relationship.table + relationship.type)) bidirectional.push(relationship.table + relationship.type)
										else biDirectionalRelationships.push(relationship.table + relationship.type);
									}

									for (const relationship of item.relationships) {
										const type = relationship.type as RelationType;

										if (typeof output.relations === 'undefined') output.relations = {};

										output.relations[relationship.table] = {
											target: pascalCase(relationship.table),
											type: type,
											joinColumn: {
												name: item.columnName,
												referencedColumnName: relationship.column
											}
										}

										if (!keyValues.primary) output.columns[item.columnName].nullable = true;

										if (bidirectional.includes(relationship.table + relationship.type)) output.relations[relationship.table].inverseSide = pascalCase(entity);
									
										if (type === 'many-to-many') {
											output.relations[relationship.table].joinTable = {};
											if  (relationship.direction === 'output') output.relations[relationship.table].joinTable.name = `${underscoreCase(output.name)}_${underscoreCase(pluralize(relationship.table))}_${underscoreCase(relationship.table)}`;
											else output.relations[relationship.table].joinTable.name = `${underscoreCase(relationship.table)}_${underscoreCase(pluralize(output.name))}_${underscoreCase(output.name)}`;
										}
										else {
											// No FK constraints at all.
											output.relations[relationship.table].createForeignKeyConstraints = false;
										}
									}
								}
							}
						}
						entitiesOutput.push(output);
					}
				}

				const ds = datasource('file-storage-default');

				// write files
				const folder = `${ds?.props?.rootPath}/projects/${adm.input.projectId}/migration/${datasourceName}/src/entity`;

				rmdir(folder);

				mkdir(folder);

				for (const entity of entitiesOutput) {
					let tn;

					try {
						tn = `${underscoreCase((entity?.name ?? '').toLowerCase())}.json`;

						await writeFile({
							file: tn,
							path: folder,
							data: JSON.stringify(entity)
						});

						console.log(`Created file "${folder}/${tn}"`);
					}
					catch (err) {
						console.log(`There was an error processing tpl "${folder}/${tn}"`);
					}
				}
			}
			catch (err) {
				console.error(`DataTransformer Output error: ${err.message}`);
				adm.setError(`DataTransformer Output error: ${err.message}`);
			}
		}
	})
	async _exec() {}
}
