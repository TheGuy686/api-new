import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';
import { EAction, SocketAction, GetOne } from '@eezze/decorators';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceConfigRepo',
})
export default class GenerateServConfigCreateUpdateAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		input: (adm: ADM) => {
			return {
				id: adm.input.scId
			}
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('type', adm.result.type);

			const md = EJson.parseKeyObject(adm.result, 'metadata');

			const tpls = [];

			for (const k in md.templates) {
				tpls.push({
					template: k,
					content: md.templates[k],
				});
			}

			lc.stash.assign.list('templates', tpls);

			await lc.result();
		},
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			'authorization': adm.request.auth.idToken,
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-serv-config-save-tpl-file',
		actionList: (adm: ADM, lc: LogicChain) => lc.stash.prop('templates'),
		requestBody: (adm: ADM, lc: LogicChain, item: any) => ({
			projectId: adm.input.projectId,
			id: adm.result.id,
			type: lc.stash.prop('type'),
			template: item.template,
			content: item.content,
		}),
	})
	async _exec() {}
}