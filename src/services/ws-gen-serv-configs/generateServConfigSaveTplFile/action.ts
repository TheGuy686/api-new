import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';
import { EAction, Do, FileSave } from '@eezze/decorators';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceConfigRepo',
})
export default class GenerateServConfigSaveTplFileAction extends BaseAction {
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text(
				'prRoot',
				`projects/${adm.input.projectId}/src/service-configurables/${(adm.input?.type ?? '').replace(/-template$/, '')}-templates`
			);

			await lc.result();
		},
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('prRoot'),
		fileName: (adm: ADM, lc: LogicChain) => (adm.input.template ?? '').replace('.ezt', ''),
		ext: 'ezt',
		content: (adm: ADM) => adm.input.content,
	})
	async _exec() {}
}