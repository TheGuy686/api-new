import BaseAction from '@eezze/base/action/BaseAction';
import { LogicChain } from '@eezze/classes';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { Command, EAction, GetOne, RenderTemplate, RepoMethod } from '@eezze/decorators';
import { kebabCase, lcFirst, pascalCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Project',
})
export default class GenerateProjectUpdateAction extends BaseAction {
	@GetOne({ checkOn: ['id'] })
	@RenderTemplate({
		template: 'project-config',
		linter: 'yaml',

		templateVars: (adm: ActionDataManager) => ({
			projectId: adm.action(0).result?.id,
			name: adm.action(0).result?.projectName,
			description: adm.action(0).result?.description,
			industry: adm.action(0).result?.industry
		})
	})
	// toPath: (adm: ActionDataManager) => {
	// 	return `${process.env.PROJECTS_FILE_ROOT}/projects/${adm.action(0).result.id}/project-config.yaml`
	// },
	@Command({
		command: (adm: ActionDataManager, lc: LogicChain) => {
			const projectId = adm.action(0).result.id;
			lc.date(Date.now()).format('YYYY-MM-DD hh:mm:ss');

			return `cd ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId} \
			&& git add . \
			&& git commit -m 'update ${lc.result()}' \
			&& git push`;
		},
	})
	async _exec() {}
}
