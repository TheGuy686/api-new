import BaseAction from '@eezze/base/action/BaseAction';
import EJson from '@eezze/classes/logic/json';
import { LogicChain, ActionDataManager as ADM } from '@eezze/classes';
import { EAction, RenderTemplate, FileSave, Do } from '@eezze/decorators';
import { kebabCase, pascalCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GenerateControllerTypeFileAction extends BaseAction {
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			const methods: any = {}, events: any = {};

			if (adm.input.type == 'rest') {
				for (const ser of adm.input.services) {
					methods[ser.method] = true;
				}
			}
			else if (adm.input.type == 'websocket') {
				for (const ser of adm.input.services) {
					if (ser.eventType == 'on-connect') {
						events['on-connection'] = true;
					}
					else if (ser.eventType == 'on-disconnect') {
						events['on-disconnect'] = true;
					}
					else events[ser.eventType] = true;
				}
			}

			lc.stash.assign.text('prRoot', `projects/${adm.input.projectId}/src`);
			lc.stash.assign.text('operationIdCc', pascalCase(adm.input.sgNameType));
			lc.stash.assign.text('operationIdKc', kebabCase(adm.input.sgName));
			lc.stash.assign.text('type', adm.input.type == 'websocket' ? 'ws' : adm.input.type);
			lc.stash.assign.text('servsRoot', () => `${lc.stash.prop('prRoot')}/services/${lc.stash.prop('operationIdKc')}`);
			lc.stash.assign.object('methods', Object.keys(methods));
			lc.stash.assign.object('events', Object.keys(events));
			lc.stash.assign.object('sgAuth', EJson.parseKeyObject(adm.input, 'sgAuth'));

			await lc.result();
		}
	})
	@RenderTemplate({
		prettify: true,
		template: (adm: ADM) => `controller-${adm.input.type}`,
		templateVars: (adm: ADM, lc: LogicChain) => ({
			datasource: adm.input.datasource,
			serviceId: lc.stash.prop('operationIdCc'),
			methods: lc.stash.prop('methods'),
			events: lc.stash.prop('events'),
			services: adm.input.services,
			type: adm.input.type,
		}),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('servsRoot'),
		fileName: (adm: ADM, lc: LogicChain) => `controller.${lc.stash.prop('type')}.ts`,
		content: (adm: ADM) => adm.result,
	})
	@RenderTemplate({
		template: 'config.yaml',
		prettify: true,
		linter: 'yaml',
		templateVars: (adm: ADM, lc: LogicChain) => ({
			serviceId: lc.stash.prop('operationIdCc'),
			description: adm.input.sgDesc,
			type: adm.input.type,
			services: adm.input.services,
			version: '1.0',
			licence: 'MIT',
			author: adm.input.userName,
		}),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.lastActionWasSkipped,
				message: 'Skipped the file save of websocket->config.yaml',
			}
		],
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('servsRoot'),
		fileName: 'config.yaml',
		content: (adm: ADM) => adm.result,
	})
	@RenderTemplate({
		template: 'authenticator.ts',
		prettify: true,
		prettifyMode: 'strict',
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.input.sgType != 'authenticator',
				message: 'There is no need to generate websocket authenticator.ts',
			}
		],
		templateVars: (adm: ADM, lc: LogicChain) => ({
			sgId: lc.stash.prop('operationIdCc'),
			...lc.stash.prop('sgAuth'),
		}),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.lastActionWasSkipped,
				message: 'Skipped the file save of websocket->authenticator.ts',
			}
		],
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('servsRoot'),
		fileName: 'authenticator.ts',
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
