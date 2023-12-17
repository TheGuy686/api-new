import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { EAction, Do, ServiceCaller, Success } from '@eezze/decorators';
import { LogicChain } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class AskAiAction extends BaseAction {
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.boolean('hasContent', false);

			await lc.result();
		}
	})
	@ServiceCaller({
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.input.context !== 'roles',
			},
		],
		service: 'RestProjectsService:askAiRoles',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM) => ({
			prompt: adm.input?.prompt,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.boolean('hasContent', true);
			lc.stash.assign.object('result', adm.result);

			await lc.result();
		},
	})
	@ServiceCaller({
		skipOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.input.context !== 'datasources',
			},
		],
		service: 'RestProjectsService:askAiProject',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM) => ({
			prompt: adm.input?.prompt,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.boolean('hasContent', true);
			lc.stash.assign.object('result', adm.result);

			await lc.result();
		}
	})
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			if (!lc.stash.prop('hasContent')) {
				adm.setSuccess('No valid context was found');
				adm.setResult('');
			}
			else {
				adm.setResult(lc.stash.prop('result'));
			}
		},
	})
	async _exec() {}

	// @Success()
	// _success(adm: ADM, lc: LogicChain) {
	// 	if (!lc.stash.prop('hasContent')) {
	// 		adm.setSuccess('No valid context was found');
	// 		adm.setResult('');
	// 	}
	// 	else {
	// 		adm.setResult(adm.result);
	// 	}
	// }
}
