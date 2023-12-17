import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';
import { LogicChain } from '@eezze/classes';
import { EAction, RenderTemplate, GetOne, FileSave, GetList, Query } from '@eezze/decorators';
import { camelCase, kebabCase } from '@eezze/libs/StringMethods';
import { getDatatypeDefault } from '@eezze/libs/utils';
import { keyify } from '@eezze/libs/ArrayMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GenerateServCreateUpdateAction extends BaseAction {
	@GetOne({
		repo: 'Mysql.ServiceRepo',
		checkOn: [ 'id' ],
		failOnEmpty: true,
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			const def = EJson.parseKeyObject(adm.result, 'definition');

			lc.stash.assign.number('sgId', adm.result.serviceGroupId);
			lc.stash.assign.object('sefd', def);
			lc.stash.assign.text('servName', adm.result.name);
			lc.stash.assign.text('servType', adm.result?.type);
			lc.stash.assign.object('actionCondition', def?.condition ?? {});

			lc.stash.assign.object(
				'actionInput',
				EJson.parseKeyArray(adm.result, 'actionInput'),
			);
			lc.stash.assign.object(
				'actionLogic',
				EJson.parseKeyObject(adm.result, 'logic'),
			);
			lc.stash.assign.object(
				'actionDef',
				EJson.parseKeyObject(adm.result, 'definition'),
			);

			await lc.result();
		}
	})
	@GetOne({
		repo: 'Mysql.ServiceGroupRepo',
		checkOn: ['id'],
		failOnEmpty: true,
		input: (adm: ADM) => ({ id: adm.result.serviceGroupId }),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('sgName', adm.result.name);
			lc.stash.assign.text('sgDesc', adm.result?.description ?? '');

			lc.stash.assign.list('datasources', () => {
				const md = EJson.parseKeyObject(adm.result, 'metadata');

				const dss = [];

				if (md?.restDs) dss.push(md.restDs);
				if (md?.wsDs) dss.push(md.wsDs);

				return dss;
			});

			lc.stash.assign.object('hosts', () => {
				const md = EJson.parseKeyObject(adm.result, 'metadata');

				const dss: any = {};

				if (md?.restDs) dss.rest = md.restDs;
				if (md?.wsDs) dss.ws = md.wsDs;

				return dss;
			});

			lc.stash.assign.text(
				'serRoot',
				() => `projects/${adm.input.projectId}/src/services/${kebabCase(lc.stash.prop('sgName'))}/${camelCase(lc.stash.prop('servName'))}`
			);
			lc.stash.assign.text('serviceGroup', kebabCase(adm.result.name));

			await lc.result();
		},
	})
	@Query({
		repo: 'Mysql.DatasourceRepo',
		query: (adm: ADM, lc: LogicChain) => {
			return `SELECT datasource.id,
			               datasource.projectId,
						   datasource.type,
						   datasource.name,
						   datasource.description,
						   datasource.metadata,
						   datasource.initModel,
						   datasource.active
					  FROM datasource datasource
				     WHERE datasource.id IN (${lc.stash.prop('datasources')})
					    OR (datasource.projectId = ${adm.input.projectId} AND datasource.type = 'eezze-logger')`;
		},
        onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('datasources', keyify(adm.result, 'id'));
			lc.stash.assign.list('connections', () => {
				const conns: any = {};

				for (const ds of adm.result) {
					ds.metadata = EJson.parseKeyObject(ds,'metadata');
					conns[ds.metadata?.connection] = true;

					if (ds.type == 'eezze-logger') {
						lc.stash.assign.text('logger', kebabCase(ds.name));
					}
				}

				return Object.keys(conns);
			});

			await lc.result();
		}
	})
	@Query({
		repo: 'Mysql.ConnectionRepo',
		failOnEmpty: true,
		query: (adm: ADM, lc: LogicChain) => {
			return `SELECT connection.id,
			               connection.projectId,
						   connection.name,
						   connection.description,
						   connection.type,
						   connection.metadata,
						   connection.state,
						   connection.active
			           FROM connection connection
			          WHERE connection.id IN (${lc.stash.prop('connections')})`;
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			for (const con of adm.result) {
				con.metadata = EJson.parseKeyObject(con, 'metadata');
			}

			const conns = keyify(adm.result, 'id');

			const dss: any[] = Object.values(lc.stash.prop('datasources') ?? []);

			for (const ds of dss) {
				if (lc.stash.prop('servType') == 'rest' && ds.type != 'rest-service') continue;
				else if (
					(lc.stash.prop('servType') == 'websocket' && ds.type != 'ws-service') &&
					(lc.stash.prop('servType') == 'websocket' && ds.type != 'eezze-logger')
				) continue;
				else if (lc.stash.prop('servType') == 'cron' && ds.type != 'cron-service') continue;

				const con = conns[ds.metadata.connection];

				let isSecure = false ?? ds?.metadata?.devIsSecure ?? con.metadata?.devIsSecure;

				let protocal;

				if (ds.type == 'ws-service') {
					ds.metadata.host = '0.0.0.0';

					if (isSecure) {
						protocal = ds?.metadata?.secureProtocol ?? con?.metadata?.secureProtocol ?? 'wss';
					}
					else protocal = ds?.metadata?.protocol ?? con?.metadata?.protocol ?? 'ws';
				}
				else {
					if (isSecure) {
						protocal = ds?.metadata?.secureProtocol ?? con?.metadata?.secureProtocol ?? 'https';
					}
					else protocal = ds?.metadata?.protocol ?? con?.metadata?.protocol ?? 'http';
				}

				let host = (ds?.metadata?.host ?? ds?.metadata?.host) ?? (con.metadata?.host ?? con?.metadata?.localhost);
				let path = con.metadata?.path ?? ds?.metadata?.path ?? '';
				let port = con.metadata?.port ?? ds?.metadata?.port ?? '';
				
				ds.url = `${protocal}://\${process.env.HOST_IP}${port ? `:${port}` : ''}${path}`;
				// ds.url = `${protocal}://${host}${port ? `:${port}` : ''}${path}`;

				lc.stash.assign.text('host', ds.url);

				// once we find the corrisponding details for the target service type then we can just break
				break;
			}

			lc.stash.assign.object('connections', conns);

			await lc.result();
		}
	})
	@RenderTemplate({
		prettify: true,
		template: 'action.action-input',
		templateVars: (adm: ADM, lc: LogicChain) => ({
			serviceGroup: lc.stash.prop('serviceGroup'),
			service: lc.stash.prop('servName'),
			actionInput: lc.stash.prop('actionInput'),
		}),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('serRoot'),
		fileName: 'input.ts',
		content: (adm: ADM) => adm.result,
	})
	@RenderTemplate({
		prettify: true,
		template: 'unit-test-service-reqest-data',
		templateVars: async (adm: ADM, lc: LogicChain) => {
			try {
				lc.object(lc.stash.prop('actionInput')).custom((src: any[]) : any => {
					const out: any = {
						headers: [],
						urlParams: [],
						requestBody: [],
					};

					for (const ai of src) {
						if (ai.baseType != 'context-mapping') continue;

						const type = ai.type;
						const matches = ai.raw.match(/^adm\.([a-zA-Z]+)\.([a-zA-Z]+)\.([a-zA-Z0-9-_]+)$/);
						const authMatches = ai.raw.match(/adm\.([a-zA-Z]+)\.auth\.([a-zA-Z]+)\.([a-zA-Z]+)$/);

						// here we continue as we don't need to process any
						// authenticator values as that comes from the user session
						if (authMatches) continue;

						if (matches) {
							const src = matches[2] == 'requestHeaders' ? 'headers' : matches[2];

							let value: any;

							if (ai.value && ai.example !+ '') {
								value = ai?.example;
							}
							else value = getDatatypeDefault(type);

							out[src].push({
								name: matches[3],
                                type,
                                value,
							});
						}
					}

					return out;
				});

				lc.object(() => {
					return {
						serviceGroup: lc.stash.prop('serviceGroup'),
						service: lc.stash.prop('servName'),
						host: lc.stash.prop('host'),
						type: lc.stash.prop('servType'),
						auth: lc.stash.prop('actionDef')?.auth,
						eventName: lc.stash.prop('actionDef')?.eventName,
						method: lc.stash.prop('actionDef')?.method,
						path: lc.stash.prop('actionDef')?.path,
						logger: lc.stash.prop('logger'),
						input: lc.current,
					};
				});

				return await lc.result();
			}
			catch (err) {
				console.log('There was an error converting your action input: ', err);
				return {};
			}
		},
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => `${lc.stash.prop('serRoot')}/unit-test/${lc.stash.prop('servType')}`,
		fileName: 'default.ts',
		content: (adm: ADM) => adm.result,
	})
	@RenderTemplate({
		template: 'action.index',
		prettify: true,
		templateVars: (adm: ADM, lc: LogicChain) => ({
			serviceGroup: lc.stash.prop('serviceGroup'),
			sdef: lc.stash.prop('sefd'),
			service: camelCase(lc.stash.prop('servName')),
			description: lc.stash.prop('sgDesc'),
			logic: lc.stash.prop('actionLogic'),
			condition: Object.keys(lc.stash.prop('actionCondition')).length > 0 ? lc.stash.prop('actionCondition') : undefined,
		}),
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => lc.stash.prop('serRoot'),
		fileName: 'action.ts',
		content: (adm: ADM) => adm.result,
	})
	async _exec() {}
}
