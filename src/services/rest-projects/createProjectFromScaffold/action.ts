import { EAction, Do, ServiceCaller, Query, GetOne, CreateOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { ESet } from '@eezze/classes/logic';
import { LogicChain } from '@eezze/classes';
import { kebabCase } from '@eezze/libs/StringMethods';

import EezzeServiceSg from '@eezze/templates/generation/eezze-service-group';
import ProjectChannelService from '@eezze/templates/generation/default-logging-channel';
import BroadcastLogService from '@eezze/templates/generation/broadcast-log';
import ExecuteUnitTestService from '@eezze/templates/generation/exec-unit-test';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: [ 'ROLE_ADMIN', 'ROLE_USER' ],
})
export default class CreateProjectFromScaffoldAction extends BaseAction {
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('logger', adm.input.project?.datasources.loggerDs);

			await lc.result();
		},
	})
	// @CreateOne({
	// 	repo: 'Mysql.Project',
	// 	input: (adm: ADM) => {
	// 		const pr = adm.input.project;

	// 		return {
	// 			projectName: (pr?.info?.projectName ?? '').replace('undefined', ''),
	// 			userId: adm.request.auth.user.id,
	// 			details: pr?.info?.details,
	// 			industry: pr?.info?.industry,
	// 			handle: pr?.info?.handle,
	// 		};
	// 	},
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		lc.stash.assign.number('projectId', adm.result.id);

	// 		await lc.result();
	// 	}
	// })
	@ServiceCaller({
		service: 'RestProjectsService:createProject',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM) => {
			const pr = adm.input.project;
			return {
				projectName: pr?.info?.projectName,
				details: pr?.info?.details,
				industry: pr?.info?.industry,
				handle: pr?.info?.handle,
			};
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.number('projectId', adm.result.id);

			await lc.result();
		}
	})
	@ServiceCaller({
		service: 'RestValueStoreService:createValueStore',
		actionListSource: (adm: ADM) => adm.input.project?.values,
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain, value: any) => ({
			projectId: adm.stash.projectId,
			...value,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			ESet(adm.stash, 'value', adm.result.map((i: any) => i.id));

			await lc.result();
		},
	})
	//create the credentials vault
	@ServiceCaller({
		service: 'RestCredentialsVaultService:createCredentialsVault',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM) => {
			return {
				projectId: adm.stash.projectId,
				...adm.input.project?.vault,
			};
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('vault', adm.result);

			try {
				adm.input.project.connection.metadata.auth.credentials = adm.result?.id;
				adm.input.project.datasources.mysqlDs.metadata.credentials = adm.result?.id;
			}
			catch (err) {
				adm.logger.error(
					`createProjectFromScaffold->Error: Could not add credentials to connection. Error: "${err.message}"`,
					'createProjectFromScaffold',
					adm,
				);
			}

			lc.stash.assign.object('connection', adm.input.project?.connection);

			await lc.result();
		}
	})
	// create the connection
	@ServiceCaller({
		service: 'RestConnectionsService:createConnection',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain, con: any) => ({
			projectId: adm.stash.projectId,
			name: lc.stash.prop('connection')?.name,
			description: lc.stash.prop('connection')?.description,
			type: lc.stash.prop('connection')?.type,
			metadata: lc.stash.prop('connection')?.metadata,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.number('conId', adm.result.id);

			await lc.result();
		},
	})
	// first here we create the logger
	@ServiceCaller({
		service: 'RestDatasourcesService:createDatasource',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain) => ({
			...lc.stash.prop('logger'),
			projectId: adm.stash.projectId,
			metadata: {
				...EJson.parseKeyObject(lc.stash.prop('logger'), 'metadata'),
				connection: lc.stash.prop('conId'),
			},
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('loggerObj', adm.result);

			const dss = [];

			if (adm.input.project?.datasources?.mysqlDs) {
				dss.push({
					...adm.input.project?.datasources?.mysqlDs,
					metadata: {
						...EJson.parseKeyObject(adm.input.project?.datasources?.mysqlDs ?? {}, 'metadata'),
						connection: lc.stash.prop('conId'),
					}
				});
			}

			lc.stash.assign.list('dss', dss);

			await lc.result();
		}
	})
	// then create the default REST DS
	@ServiceCaller({
		service: 'RestDatasourcesService:createDatasource',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain) => ({
			...adm.input.project?.datasources?.restDs,
			projectId: lc.stash.prop('projectId'),
			metadata: {
				...EJson.parseKeyObject(adm.input.project?.datasources?.restDs ?? {}, 'metadata'),
				logger: lc.stash.prop('loggerObj')?.id,
				connection: lc.stash.prop('conId'),
			},
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('restDsResult', adm.result);
			await lc.result();
		}
	})
	// then create the default WebSocket DS
	@ServiceCaller({
		service: 'RestDatasourcesService:createDatasource',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain) => ({
			...adm.input.project?.datasources?.wsDs,
			projectId: lc.stash.prop('projectId'),
			metadata: {
				...EJson.parseKeyObject(adm.input.project?.datasources?.wsDs ?? {}, 'metadata'),
				logger: lc.stash.prop('loggerObj')?.id,
				connection: lc.stash.prop('conId'),
			},
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('wsDsResult', adm.result);
			await lc.result();
		}
	})
	// this is a loop. We need to do this as we still don't have a good way of conditional action. So on success of the create logger then 
	// we this to an array if it exists. If it doesn't exist then we just pass an empty array to this action and it will get ignored
	@ServiceCaller({
		service: 'RestDatasourcesService:createDatasource',
		actionListSource: (adm: ADM, lc: LogicChain) => lc.stash.prop('dss'),
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain, ds: any) => ({
			...ds,
			projectId: lc.stash.prop('projectId'),
			metadata: {
				...ds.metadata,
				connection: lc.stash.prop('conId'),
			},
		}),
	})
	// Create the roles
	@ServiceCaller({
		service: 'RestRolesService:createRole',
		actionListSource: (adm: ADM) => adm.input.project?.roles,
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain, role: any) => ({
			projectId: adm.stash.projectId,
			...role,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.list('roles', adm.result.map((i: any) => i.id));

			await lc.result();
		}
	})
	// Create the service group and set dependencies
	@ServiceCaller({
		service: 'RestServsGroupsService:createServsGroup',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain, role: any) => {
			const obj: any = {
				...EezzeServiceSg,
				projectId: adm.stash.projectId,
			};

			// here we need to add the wsResource details to the service group so that
			// we can create a valid  logger / eezze service ws service group + services
			obj['metadata']['restDs'] = lc.stash.prop('restDsResult').id;
			obj['metadata']['restDsName'] = kebabCase(lc.stash.prop('restDsResult').name);

			obj['metadata']['wsDs'] = lc.stash.prop('wsDsResult').id;
			obj['metadata']['wsDsName'] = kebabCase(lc.stash.prop('wsDsResult').name);

			return obj;
		},
		onSuccess: async (adm: ADM, lc: LogicChain, res: any) => {
			lc.stash.assign.object('sg', adm.result);

			lc.stash.assign.list('servs', [
				{
					...ProjectChannelService,
					logic: JSON.stringify(ProjectChannelService.logic, null, 4),
					projectId: adm.stash.projectId,
					serviceGroupId: adm.result.id,
				},
				{
					...BroadcastLogService,
					logic: JSON.stringify(BroadcastLogService.logic, null, 4),
					projectId: adm.stash.projectId,
					serviceGroupId: adm.result.id,
				},
				{
					...ExecuteUnitTestService,
					logic: JSON.stringify(ExecuteUnitTestService.logic, null, 4),
					projectId: adm.stash.projectId,
					serviceGroupId: adm.result.id,
				},
			]);

			await lc.result();
		}
	})
	@ServiceCaller({
		service: 'RestServsService:createServ',
		actionListSource: (adm: ADM, lc: LogicChain) => lc.stash.prop('servs'),
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM, lc: LogicChain, serv: any) => serv,
	})
	@GetOne({
		repo: 'Mysql.Project',
		checkOn: [ 'id' ],
		input: (adm: ADM, lc: LogicChain) => ({
			id: lc.stash.prop('projectId'),
		})
	})
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM project`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM connection`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM datasource`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM role`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM value_store`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM credentials_vault`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM service_group`;
	// 	}
	// })
	// @Query({
	// 	repo: 'Mysql.Project',
	// 	query: (adm: ADM) => {
	// 		return `DELETE FROM service`;
	// 	}
	// })
	async _exec() {}
}


// DELETE FROM project;
// DELETE FROM connection;
// DELETE FROM datasource;
// DELETE FROM service_config;
// DELETE FROM `role`;
// DELETE FROM value_store;
// DELETE FROM credentials_vault;
// DELETE FROM service_group;
// DELETE FROM `service`;