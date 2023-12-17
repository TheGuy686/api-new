import BaseAction from '@eezze/base/action/BaseAction';
import { LogicChain } from '@eezze/classes';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, ReplaceOne, GetOne, RenderTemplate, EWhen, DataTransformer, SocketAction } from '@eezze/decorators';
import { rmdir } from '@eezze/libs/FileMethods'
import { kebabCase, pascalCase, lcFirst } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.EntityRepo',
})
export default class GenerateAllEntitiesAction extends BaseAction {
	// Entity state used to remove existing model generation directories
	// before new files are generated.
	@GetOne({
		checkOn: ['datasourceId'],
		repo: 'Mysql.EntityRepo',
		input: (adm: ActionDataManager) => ({
			datasourceId: adm.input.id
		})
	})
	@EWhen({
		source: (adm: ActionDataManager) => {
			if (typeof adm?.action(0).result.entityItems !== 'undefined') {
				return JSON.parse(adm?.action(0).result.entityItems);
			}
			else {
				return {};
			}
		},
		condition: (adm: ActionDataManager, lc?: LogicChain, items?: any) => Object.keys(items).length > 0,
		action: (adm: ActionDataManager, lc?: LogicChain, items?: any) => {
			const entities = Object.keys(items);

			for (const entityName of entities) {
				// delete model directories, directories can be there, if not found, ignore.
				try {
					rmdir(`${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}/src/models/${kebabCase(entityName)}-model`, true);
				} catch (err) {
					// ignore, continue.
					adm.logger.info(`Directory not found: ${err.message}`);
				}
			}
		}
	})
	@ReplaceOne({
		input: (adm: ActionDataManager) => {
			if (adm.action(0).result.id) {
				return {
					id: adm.action(0).result.id,
					datasourceId: adm.input.id,
					projectId: adm.input.projectId,
					entityItems: adm.input.entities
				};
			}
			else {
				return {
					datasourceId: adm.input.id,
					projectId: adm.input.projectId,
					entityItems: adm.input.entities
				};
			}
		},
	})
	@DataTransformer({
		output: async (adm: ActionDataManager, lc: LogicChain) => {
			interface Key {
				key: boolean;
				unique: boolean;
				primary: boolean;
				spatial: boolean;
				fulltext: boolean;
			}

			interface Model {
				ignore: boolean;
				required: boolean;
			}

			interface Relationship {
				table: string;
				column: string;
				direction: "input" | "output";
				type: string // "one-to-one" | "one-to-many" | "many-to-one" | 'many-to-many';
			}

			interface EntityColumn {
				entityName: string;
				columnName: string;
				dataType: string;
				length: string;
				unsigned: string;
				allow_null: boolean;
				key: Key;
				model: Model;
				relationships?: Relationship[];
			}

			type ORMInput = Record<string, EntityColumn[]>;

			function transformRelationships(input: ORMInput): ORMInput {
				const output: ORMInput = JSON.parse(JSON.stringify(input)); // Deep copy
			
				for (const entityName in output) {
					output[entityName].forEach(column => {
						column.relationships?.forEach(rel => {
							if (rel.direction === "output") {
								const relatedEntity = output[rel.table];
								let inverseType = '';

								switch (rel.type) {
									case "one-to-many":
										inverseType = "many-to-one";
										break;
									case "many-to-one":
										inverseType = "one-to-many";
										break;
									case "many-to-many":
										inverseType = "many-to-many";
										break;
									case "one-to-one":
										inverseType = "one-to-one";
										break;
								}

								const existingInverseRelationship = relatedEntity
									.flatMap(e => e.relationships || [])
									.find(r => r.table === entityName && r.column === column.columnName);
			
								if (existingInverseRelationship) {
									// Adjust existing inverse relationship if necessary
									if (existingInverseRelationship.type !== inverseType) {
										existingInverseRelationship.type = inverseType;
									}
								} else {
									// Add new inverse relationship, output part is considered the starting point therefore input must be the other side.
									const relatedColumn = relatedEntity.find(e => e.columnName === rel.column);
									if (relatedColumn) {
										relatedColumn.relationships = relatedColumn.relationships || [];
										relatedColumn.relationships.push({
											table: entityName,
											column: column.columnName,
											direction: "input",
											type: inverseType
										});
									}
								}
							}
						});
					});
				}
			
				return output;
			}
			

			const entities = transformRelationships(JSON.parse(adm.input.entities));

			adm.setResult(entities);
		}
	})
	@SocketAction({
		urlParams: (adm: ActionDataManager) => ({
			'authorization': adm.request.auth.idToken,
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-entity-update',
		actionList: (adm: ActionDataManager, lc: LogicChain) => {
			const items = adm.result;
			const keys = Object.keys(items);
			const list = [];

			for (let index = 0; index < keys.length; index++) {
				list.push({
					name: keys[index],
					value: items[keys[index]]
				})
			}

			return list;
		},
		requestBody: (adm: ActionDataManager, lc: LogicChain, item: any) => {
			return {
				projectId: adm.input.projectId,
				datasourceId: adm.input.id,
				type: adm.input.type,
				entityItem: item,
			};
		},
	})
	async _exec() { }
}
