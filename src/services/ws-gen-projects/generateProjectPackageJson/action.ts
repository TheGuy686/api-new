import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import { EAction, FileSave, Query, RenderTemplate } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GenerateProjectPackageJsonAction extends BaseAction {
	@Query({
		repo: 'Mysql.DatasourceRepo',
		query: (adm: ADM, lc: LogicChain) => `
			 SELECT datasource.id,
					datasource.projectId,
					datasource.type,
					datasource.name,
					datasource.description,
					datasource.metadata,
					datasource.initModel,
					datasource.active
				FROM datasource datasource
				WHERE datasource.projectId = ?
				AND datasource.type IN(?)
				AND datasource.active = true
		`,
		input: (adm: ADM, lc: LogicChain) => ([
			adm.input.projectId,
			[ 'rest-service', 'ws-service', 'eezze-logger' ]
		]),
	})
	@RenderTemplate({
		prettify: true,
		template: 'project-package',
		linter: 'json',
		templateVars: (adm: ADM) => ({
			name: adm.input.projectName,
			description: adm.input.description,
			author: adm.input.author,
			dss: adm.result.filter((ds: any) => { // requires this filter, otherwise the loop will cause an invalid json object.
				return ds.type === 'rest-service' || ds.type === 'ws-service';
			}),
		})
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => `projects/${adm.input.projectId}`,
		fileName: 'package.json',
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
