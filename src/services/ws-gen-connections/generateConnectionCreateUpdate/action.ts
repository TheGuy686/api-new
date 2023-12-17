import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';
import { LogicChain } from '@eezze/classes';
import { EAction, RenderTemplate, GetOne, FileSave } from '@eezze/decorators';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ConnectionRepo',
})
export default class GenerateConnectionCreateUpdateAction extends BaseAction {
	@GetOne({
		checkOn: ['id'],
		failOnEmpty: true,
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('prRoot', `projects/${adm.result.projectId}/src`);
			lc.stash.assign.text('connsRoot', () => `${lc.stash.prop('prRoot')}/connections`);
			lc.stash.assign.text('servsRoot', () => `${lc.stash.prop('prRoot')}/servers`);

			const md = EJson.parseKeyObject(adm.result, 'metadata');

			lc.stash.assign.object('con', {
				id: adm.result.id,
				name: adm.result.name,
				type: adm.result.type,
				serviceTypes: md?.serviceTypes,
				secure: `${!!md?.secure}`,
				secureProtocol: md?.secureProtocol,
				protocol: md?.protocol,
				host: md?.host,
				localhost: md?.localhost,
			});

			await lc.result();
		},
	})
	@RenderTemplate({
		prettify: true,
		template: 'connection',
		templateVars: (adm: ADM, lc: LogicChain) => lc.stash.prop('con'),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('connsRoot'),
		fileName: (adm: ADM, lc: LogicChain) => `${kebabCase(lc.stash.prop('con').name)}.ts`,
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}