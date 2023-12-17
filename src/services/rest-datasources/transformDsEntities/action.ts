import { DataTransformer, EAction, SocketAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';

type EntityModelI = {
	relationships?: any[], // relationships in and out
	entityName?: string, // entity name, unformatted, needed for template generation
	columnName?: string, // column name, unformatted
	dataType?: string, // column data type
	length?: string, // column max length
	unsigned?: boolean; // signed or unsigned value
	allow_null?: boolean, // allow null values
	key?: { // key related properties
		key?: boolean, // key? generating or part of a key?
		unique?: boolean, // unique column
		primary?: boolean, // primary key
		spatial?: boolean, // not used yet
		fulltext?: boolean, // not used yet.
	},
	model?: { // model related properties
		ignore?: boolean, // ignore column in model
		required?: boolean // required field in the model.
	}
};

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class TransformDsEntitiesAction extends BaseAction {
	@GetOne({
		checkOn: [ 'id' ],
		failOnEmpty: true,
	})
	@DataTransformer({
		output: (adm: ADM) => {
			function getTableAndColumnnName(tables: any[], entityId: number) {
				for (const table of tables) {
					const columns = table.modules;

					if (columns && Array.isArray(columns)) {
						for (const column of columns) {
							if (column.id === entityId) {
								return {
									table: table.name,
									column: column.name
								};
							}
						}
					}
				}
				throw Error(`Entity with ID: ${entityId} not found!`);
			}

			function setRelationships(column: any, table: any, entityModel: EntityModelI, tables: any[]) {
				for (const direction of ['input', 'output']) {
					if (Object.keys(column[direction]).length > 0) {
						const relationships = Object.keys(column[direction]);

						for (const relation of relationships) {
							const relationObj = column[direction][relation];
							const type = relations[relationObj.data.type];

							if (typeof entityModel.relationships === 'undefined') entityModel.relationships = [];

							if (relationObj.entity_id !== null) {
								entityModel.relationships.push({
									...getTableAndColumnnName(tables, relationObj.entity_id),
									direction,
									type
								});
							}
						}
					}
				}
			}

			// translation table from EVE model to internal naming.
			const relations: { [key: string]: string } = {
				'1:1': 'one-to-one',
				'1:n': 'one-to-many',
				'n:1': 'many-to-one',
				'm:n': 'many-to-many',
			};

			try {
				const tables = EJson.parseKeyArray(adm.result, 'initModel');

				if (Array.isArray(tables)) {
					const entities: {[key: string]: EntityModelI[] } = {};

					for (const table of tables) {
						if (table.type === 'dbTable') {
							if (!table.name) {
								adm.logger.info(`TransformDsEntitiesAction->Entity name was not set`);
								continue;
							}

							entities[table.name] = [];

							if (table.modules && Array.isArray(table.modules)) {
								const columns = table.modules;

								for (const column of columns) {
									if (column.type === 'dbColumn') {
										const entity: EntityModelI = {};

										setRelationships(column, table, entity, tables);

										entity.entityName = table.name;
										entity.columnName = column.name;
										entity.dataType = column.dataType;
										entity.length = column.length;
										entity.unsigned = column.length;
										entity.allow_null = column.allow_null;
										entity.key = {
											key: column.key_key,
											unique: column.key_unique,
											primary: column.key_primary,
											spatial: column.key_spatial,
											fulltext: column.key_fulltext,
										};
										entity.model = {
											ignore: column.model_ignore,
											required: column.model_required
										};

										entities[table.name].push(entity);
									}
								}
							}
						}
					}

					adm.setResult({
						...adm.result,
						entities
					});
				}
			}
			catch (err) {
				adm.logger.error(`Entity Transformation error: ${err.message}`, 'UpdateDatasourceEntitiesAction: DataTransformer>output');
				throw Error(`Entity Transformation error: ${err.message}`);
			}
		},
	})
	async _exec() {}
}
