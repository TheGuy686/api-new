import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';
import { EAction, FileDelete, GetOne } from '@eezze/decorators';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.DatasourceRepo',
})
export default class GenerateDatasourceDeleteAction extends BaseAction {
	@GetOne({
		checkOn: [ 'projectId', 'id' ],
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text(
				'tplRoot',
				`projects/${adm.input.projectId}/src/datasources`,
			);
			lc.stash.assign.text('tplName', `${kebabCase(adm.result.type)}-${kebabCase(adm.result.name)}`);

			await lc.result();
		}
	})
	@FileDelete({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplRoot'),
		fileName: (adm: ADM, lc: LogicChain) => lc.stash.prop('tplName'),
		ext: 'ts',
	})
	// @EWhen({
	// 	source: (adm: ActionDataManager) => adm?.input,
	// 	condition: (adm: ActionDataManager, items: any) => true,
	// 	actions: [{
	// 		condition: (adm: ActionDataManager, sourceItem: any) => true,
	// 		action: (adm: ActionDataManager, item: any) => {
	// 			try {
	// 				deleteFile(
	// 					`${process.env.PROJECTS_FILE_ROOT}/projects/${adm.input.projectId}/src/datasources/${adm.input.type.toLowerCase()}-${adm.input.name}.ts`, true
	// 				)
	// 			} catch (err) {
	// 				adm.logger.info(`Delete file does not exist: ${err.message}`);
	// 			}
	// 		}
	// 	}]
	// })
	async _exec() {}
}
