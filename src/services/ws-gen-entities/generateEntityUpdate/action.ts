import BaseAction from '@eezze/base/action/BaseAction';
import { LogicChain } from '@eezze/classes';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, ReplaceOne, GetOne, RenderTemplate, EWhen, FileSave } from '@eezze/decorators';
import { rmdir } from '@eezze/libs/FileMethods'
import { kebabCase, pascalCase, lcFirst } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.EntityRepo',
})
export default class GenerateEntityUpdateAction extends BaseAction {
	@GetOne({
		repo: 'Mysql.Datasource',
		checkOn: [ 'id' ],
		input: (adm: ActionDataManager, lc: LogicChain) => {
			return {
				id: adm.input.datasourceId
			}
		},
		failOnEmpty: true,
		onSuccess: async (adm: ActionDataManager, lc: LogicChain) => {
			lc.stash.assign.object('datasource', adm.result);

			await lc.result();
		}
	})
	@RenderTemplate({
		template: 'entity',
		prettify: true,
		templateVars: (adm: ActionDataManager, lc: LogicChain) => {
			const entity = JSON.parse(adm.input.entityItem);

			return {
				entity: entity.name,
				columns: entity.value
			}
		},
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ActionDataManager, lc: LogicChain) => {
			const entity = JSON.parse(adm.input.entityItem);

			const projectId = adm.input.projectId
			const name = kebabCase(entity.name);

			return `/projects/${projectId}/src/models/${name}-model`;
		},
		fileName: 'index.ts',
		content: (adm: ActionDataManager) => adm.result,
	})
	@RenderTemplate({
		template: 'repository',
		prettify: true,
		templateVars: (adm: ActionDataManager, lc: LogicChain) => {
			const entity = JSON.parse(adm.input.entityItem);
			const datasource = adm.stash.datasource;

			return {
				entity: pascalCase(entity.name),
				datasource: kebabCase(datasource.name),
				datasourceType: pascalCase(adm.input.type)
			}
		},
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ActionDataManager, lc: LogicChain) => {
			const entity = JSON.parse(adm.input.entityItem);
			const datasource = adm.stash.datasource;
			const projectId = adm.input.projectId

			return `/projects/${projectId}/src/repos/${kebabCase(datasource.name)}`;
		},
		fileName:  (adm: ActionDataManager, lc: LogicChain) => {
			const entity = JSON.parse(adm.input.entityItem);
			const name = kebabCase(entity.name);

			return `${name}-repo.ts`;
		},
		content: (adm: ActionDataManager) => adm.result,
	})
	async _exec() {}
}
