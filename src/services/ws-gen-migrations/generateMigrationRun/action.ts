import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { Command, EAction, GetOne } from '@eezze/decorators';
import { pascalCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
	condition: (adm: ActionDataManager) => {
		if (adm.input.type === "Mysql") return true;
		else return false;
	},
	exceptions: [
		{
			name: 'type-not-satisfied',
			condition:  (adm: ActionDataManager) => {
				return adm?.request?.hasExecExemption('condition-not-satisfied')
			}
		}
	]
})
export default class GenerateMigrationRunAction extends BaseAction {
	@GetOne({
		checkOn: ['id']
	})
	@Command({
		command: (adm: ActionDataManager) => {
			const projectId = adm.action(0).result.projectId;
			const name = pascalCase(adm.action(0).result.name);

			return `npm --prefix ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/migration/${name} run create-migration`;
		},
	})
	@Command({
		command: (adm: ActionDataManager) => {
			const projectId = adm.action(0).result.projectId;
			const name = pascalCase(adm.action(0).result.name);

			return `npm --prefix ${process.env.PROJECTS_FILE_ROOT}/projects/${projectId}/migration/${name} run run-migration`;
		},
	})
	async _exec() {}
}
