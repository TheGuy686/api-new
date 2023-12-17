import BaseAction from '@eezze/base/action/BaseAction';
import EJson from '@eezze/classes/logic/json';
import { LogicChain, ActionDataManager as ADM } from '@eezze/classes';
import { EAction, GetOne, GetList, SocketAction } from '@eezze/decorators';
import { ucFirst } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.ServiceGroupRepo',
})
export default class GenerateControllerCreateUpdateAction extends BaseAction {
	@GetOne({
		checkOn: [ 'id' ],
		failOnEmpty: true,
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			const md = EJson.parseKeyObject(adm.result, 'metadata');

			lc.stash.assign.number('sgId', adm.result.id);
			lc.stash.assign.text('sgName', adm.result.name);
			lc.stash.assign.text('sgDesc', adm.result?.description ?? '');
			lc.stash.assign.text('sgType', adm.result.type);
			lc.stash.assign.object('sgMd', md);

			const dict: any = {};

			const auth = JSON.parse(JSON.stringify({
				additionalHeaders: md?.additionalHeaders,
				sources: md?.sources,
				secret: md?.secret,
				user: md?.user,
				roles: md?.roles,
			}));

			if (md?.restDsName) dict.rest = md?.restDsName;
			if (md?.wsDsName) dict.websocket = md?.wsDsName;
			if (md?.cronDsName) dict.cron = md?.cronDsName;

			lc.stash.assign.object('sgResourceDict', dict);
			lc.stash.assign.object('auth', auth);

			await lc.result();
		},
	})
	@GetList({
		repo: 'Mysql.ServiceRepo',
		checkOn: [ 'serviceGroupId' ],
		input: (adm: ADM, lc: LogicChain) => ({
			serviceGroupId: lc.stash.prop('sgId'),
		}),
		output: async (adm: ADM, lc: LogicChain, results: any[]) => {
			lc.object(results).custom((arg1: any): any => {
				const out: any = {};

				if (Array.isArray(results)) {
					for (const serv of results) {
						const ds = lc.stash.prop('sgResourceDict')?.[serv.type];

						if (typeof out[ds] == 'undefined') {
							out[ds] = {
								ds: lc.stash.prop('sgResourceDict')?.[serv.type],
								sgName: lc.stash.prop('sgName'),
								// sgNameType: `${ucFirst(serv.type == 'websocket' ? 'ws' : serv.type)} ${lc.stash.prop('sgName')}`,
								sgNameType: lc.stash.prop('sgName'),
								sgType: lc.stash.prop('sgType'),
								sgMetadata: lc.stash.prop('sgMd'),
								sgDesc: lc.stash.prop('sgDesc'),
								sgAuth: lc.stash.prop('auth'),
								type: serv.type,
								name: serv?.name,
								services: [],
							};
						}

						const def = EJson.parseKeyObject(serv, 'definition');

						if (serv.type == 'websocket') {
							out[ds].services.push(JSON.parse(JSON.stringify({
								datasource: def?.datasourceName,
								direction: def?.direction,
								name: serv.name,
								eventType: def?.eventType,
								eventName: def?.eventName,
								id: def?.id,
								channel: def?.channel,
								connection: def?.connection,
								user: def?.user,
								emitState: def?.emitState,
								onConnectionSubscribe: def?.onConnectionSubscribe,
								onDisConnectionSubscribe: def?.onDisConnectionSubscribe,
							})));
						}
						else {
							out[ds].services.push({
								datasource: def?.datasourceName,
								name: serv.name,
								method: def?.method,
								path: '/' + def?.path.replace(/^\//, '') ?? '',
								authenticator: def?.auth ? def?.authKey : undefined,
							});
						}
					}
				}

				return Object.values(out);
			});

			return await lc.result();
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('controllers', adm.result);

			await lc.result();
		},
	})
	@SocketAction({
		actionList: (adm: ADM, lc: LogicChain) => lc.stash.prop('controllers'),
		urlParams: (adm: ADM) => ({
			authorization: adm.request.auth.idToken,
		}),
		eventName: 'generate-controller-type-file',
		datasource: 'integration-eezze-ws',
		requestBody: (adm: ADM, lc: LogicChain, item: any) => ({
			projectId: adm.input.projectId,
			datasource: item.ds,
			sgName: item.sgName,
			sgDesc: item.sgDesc,
			sgType: item.sgType,
			sgMetadata: item.sgMetadata,
			sgAuth: item.sgAuth,
			sgNameType: item.sgNameType,
			type: item.type,
			services: EJson.stringify(item?.services),
		}),
	})
	async _exec() {}
}
