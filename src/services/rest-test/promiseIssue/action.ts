import { EAction, GetOne, RenderTemplate, EWhen, FileSave } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { deleteFile, fileExists } from '@eezze/libs/FileMethods'
import { camelCase, kebabCase } from '@eezze/libs/StringMethods';
import { LogicChain } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceRepo',
})
export default class PromiseIssueAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('serviceNameKc', kebabCase(adm.result.name));
			lc.stash.assign.text('serviceNameCc', camelCase(adm.result.name));

			await lc.result();
		}
	})
	@GetOne({
		repo: 'Mysql.ServiceGroupRepo',
		checkOn: ['id'],
		input: (adm: ADM) => ({ id: adm.result.serviceGroupId }),
		onSuccess: (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('servPath', `${process.env.PROJECT_FILE_PATH}/projects/${adm.result.projectId}/src/services/${kebabCase(adm.result.name)}`);
			lc.stash.assign.text('sgName', kebabCase(adm.result.name));
		}
	})
	@EWhen({
		source: (adm: ADM) => adm?.input,
		actions: [
			{
				condition: (adm: ADM, lc: LogicChain) => fileExists(`${lc.stash.prop('servPath')}/${lc.stash.prop('serviceNameCc')}/action/action-input.ts`),
				action: (adm: ADM, lc: LogicChain) => {
					deleteFile(`${lc.stash.prop('servPath')}/${lc.stash.prop('serviceNameCc')}/action/action-input.ts`)
				}
			},
			{
				condition: (adm: ADM, lc: LogicChain) => fileExists(`${lc.stash.prop('servPath')}/${lc.stash.prop('serviceNameCc')}/action/index.ts`),
				action: (adm: ADM, lc: LogicChain) => {
					deleteFile(`${lc.stash.prop('servPath')}/${lc.stash.prop('serviceNameCc')}/action/index.ts`)
				}
			},
			{
				condition: (adm: ADM, lc: LogicChain) => {
					return fileExists(`${lc.stash.prop('servPath')}/${lc.stash.prop('serviceNameCc')}/service.ts`);
				},
				action: (adm: ADM, lc: LogicChain) => {
					deleteFile(`${lc.stash.prop('servPath')}/${lc.stash.prop('serviceNameCc')}/service.ts`)
				}
			},
		]
	})
	@RenderTemplate({
		template: 'action.action-input',
		templateVars: (adm: ADM, lc: LogicChain) => ({
			serviceGroup: lc.stash.prop('sgName'),
			service: lc.stash.prop('serviceNameCc'),
			actionInput: JSON.parse(adm.action(0).result?.actionInput),
		})
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const service = lc.stash.prop('serviceNameCc');
			const projectId = adm.input.projectId;

			return `projects/${projectId}/src/services/${lc.stash.prop('sgName')}/${service}/action`;
		},
		fileName: 'action-input.ts',
		content: (adm: ADM) => adm.result,
	})
	@RenderTemplate({
		template: 'test',
		templateVars: (adm: ADM, lc: LogicChain) => ({
			serviceGroup: lc.stash.prop('sgName'),
			service: lc.stash.prop('serviceNameCc'),
			logic: JSON.parse(adm.action(0).result?.logic),
			description: adm.action(0).result?.description,
			message: lc.stash.prop('sgName')
		})
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => {
			const serviceGroup = lc.stash.prop('sgName');
			const service = lc.stash.prop('serviceNameCc');
			const projectId = adm.input.projectId;

			return `projects/${projectId}/src/services/${serviceGroup}/${service}/action`;
		},
		fileName: 'index.ts',
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}