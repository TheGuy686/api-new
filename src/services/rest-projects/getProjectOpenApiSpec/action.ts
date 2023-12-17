import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { Do, EAction, GetList, GetOne, ServiceCaller } from '@eezze/decorators';
import { LogicChain } from '@eezze/classes';
import { camelCase, kebabCase, pascalCase, underscoreCase } from '@eezze/libs/StringMethods';

import ProjectModel from 'models/project-model';
import RoleModel from 'models/role-model';
import VaultModel from 'models/credentials-vault-model';
import ValueStoreModel from 'models/value-store-model';
import ConnectionModel from 'models/connection-model';
import DatasourceModel from 'models/datasource-model';
import EJson from '@eezze/classes/logic/json';
import { keyify } from '@eezze/libs/ArrayMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GetProjectOpenApiSpecAction extends BaseAction {
	@ServiceCaller({
        service: 'RestProjectsService:allProjects',
        headers: (adm: ADM) => ({
			authorization: adm.request.auth.idToken,
		}),
		failOn: [
			{
				condition: (adm: ADM) => {
					const out: any[] = [];

					for (const pr of adm.result) out.push(pr.id);

					return out.includes(adm.input.projectId);
				},
				message: 'please-verify-email',
			},
		],
	})
	@GetOne({
		repo: 'Mysql.ProjectRepo',
		checkOn: [ 'id' ],
		maximumDepth: 6,
		failOnEmpty: true,
		input: (adm: ADM) => {
			return {
				id: adm.input.projectId,
			}	
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('proj', adm.result);

			await lc.result();
		}
	})
	@GetOne({
		repo: 'Mysql.UserRepo',
		checkOn: [ 'id' ],
		maximumDepth: 1,
		failOnEmpty: true,
		input: (adm: ADM) => {
			return {
				id: adm.result.userId,
			}	
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('creator', adm.result);
			await lc.result();
		}
	})
	// @GetList({
	// 	repo: 'Mysql.ConnectionRepo',
	// 	checkOn: [ 'projectId' ],
	// 	input: (adm: ADM) => ({
	// 		id: adm.input.projectId,
	// 	}),
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		lc.stash.assign.list('conns', adm.result);

	// 		await lc.result();
	// 	},
	// })
	// @GetList({
	// 	repo: 'Mysql.DatasourceRepo',
	// 	checkOn: [ 'projectId' ],
	// 	input: (adm: ADM) => ({
	// 		projectId: adm.input.projectId,
	// 	}),
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		lc.stash.assign.list('dss', adm.result);

	// 		await lc.result();
	// 	},
	// })
	@GetList({
		repo: 'Mysql.ServiceGroupRepo',
		checkOn: [ 'projectId' ],
		input: (adm: ADM) => ({
			projectId: adm.input.projectId,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			const tagsDict: any = {}, tageLu: any = {};

			for (const sg of adm.result) {
				tagsDict[sg.name] = {
					name: sg.name,
					description: sg.description,
				};
				tageLu[sg.id] = sg.name;
			}

			lc.stash.assign.object('sgs', keyify(adm.result, 'id'));
			lc.stash.assign.object('tagsRoot', adm.result);
			lc.stash.assign.object('tagsLu', tageLu);
			
			await lc.result();
		},
	})
	@GetList({
		repo: 'Mysql.ServiceRepo',
		checkOn: [ 'projectId' ],
		input: (adm: ADM) => ({
			projectId: adm.input.projectId,
		}),
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.list('servs', adm.result);

			await lc.result();
		},
	})
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			const out: any = {
				openapi: '3.0.0',
				info: {
					title: lc.stash.prop('proj').name,
					description: lc.stash.prop('proj').description,
					termsOfService: 'https://koumoul.com/term-of-service',
					contact:{
						name: `${lc.stash.prop('creator').firstName} ${lc.stash.prop('creator').lastName}`,
						url: 'https://eezze.io',
						email: lc.stash.prop('creator').email,
					},
					version: '1.0.0',
				},
				tags: lc.stash.prop('tagsRoot'),
				servers: [
					{
						url: 'http://localhost:2002/v1',
						description: 'Default Server',
					}
				],
				externalDocs: {
					description: `${lc.stash.prop('proj').name}`,
					url: 'https://koumoul.com/documentation',
				},
				components: {
					securitySchemes: {
						apiKey: {
							type: 'apiKey',
							name: 'x-taxman-key-RYAN',
							in: 'header'
						},
						jwt: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT'
						}
					},
				},
				security: [
					{
						apiKey:[
						   
						]
					 },
					 {
						jwt: [
						   
						]
					 }
				],
				paths: {},
			}

			const servTypes: any = {
				ws: [],
			}

			const sgs = lc.stash.prop('sgs');

			for (const serv of lc.stash.prop('servs')) {
				if (serv.type != 'rest') {
					servTypes.ws.push(serv);
					continue;
				}

				const def = EJson.parseKeyObject(serv, 'definition');
				const sg = lc.stash.prop('tagsLu')[serv.serviceGroupId];
				const sgObj = sgs[serv.serviceGroupId];
				const sgMd = EJson.parseKeyObject(sgObj, 'metadata');

				// here is where we filter out all the services on this ds filter
				if (sgMd?.restDs != adm.input.dsFilter) continue;

				const ai = EJson.parseKeyObject(serv, 'actionInput');

				if (typeof out.paths[`/${def.path}`] == 'undefined') {
					out.paths[`/${def.path}`] = {};
				}

				const objIn: any = {
					tags: [ sg ],
					summary: serv.name,
					description: serv.description,
					operationId: camelCase(serv.name),
					'x-operationType': 'http://schema.org/CheckAction',
					parameters: [
						// {
						// 	name: 'q',
						// 	description: 'N\'importe quels éléments d\'une adresse',
						// 	'in': "query",
						// 	required: false,
						// 	schema: { type: 'string' },
						// }
					],
					requestBody: {
						description: "Ensemble de documents à géocoder",
						required: true,
						content: {
						   'application/json': {
								schema: {
									type: 'array',
									items: {
										title: 'Main Input',
										type: 'object',
										properties: {
											// key: {
											// 	type: 'string',
											// 	description: 'Identifiant de la ligne dans la requête en masse',
											// },
										}
									}
								}
						   },
						   'text/csv': {},
						}
					},
					responses: {
						'200': {
							description: 'Documents complétés par les champs lat, lon et matchLevel',
							content: {
							   'application/json': {},
							   'text/csv': {},
							}
						}
					},
				};

				if (ai.length > 0) {
					for (const p of ai) {
						if (p.baseType != 'context-mapping') continue;

						const matches = p.raw.match(/request\.([requestHeaders|urlParams|requestBody]+)\.([a-zA-Z0-9_-]+)/);

						// if there is no match on these three criteria then there is no need to process them as
						// rom the open API point of view we only need to care about input in these three areas
						if (!matches) continue;

						switch (matches[1]) {
							case 'requestHeaders': {
								objIn.parameters.push({
									name: matches[2],
									description: `URL parameter mapping to input "${p.property}"`,
									'in': 'header',
									required: false,
									schema: { type: 'string' },
								});
								break;
							}
							case 'urlParams': {
								objIn.parameters.push({
									name: matches[2],
									description: `URL parameter mapping from "${matches[2]}" to action input "${p.property}"`,
									'in': 'query',
									required: false,
									schema: { type: 'string' },
								});
								break;
							}
							case 'requestBody': {
								objIn.requestBody.content['application/json'].schema.items.properties[matches[2]] = {
									type: p.type,
									description: `Request body mapping from input "${matches[2]}" to action input "${p.property}"`,
								}
							}
						}
					}

					objIn.parameters.sort((a: any, b: any) => {
						if (a.in < b.in) return 1;
						if (a.in > b.in) return -1;
						return 0;
					});
				}

				out.paths[`/${def.path}`][def.method] = objIn;

				console.log('SERV: ', def, serv);
			}
			
			adm.setResult(out);
		}
	})
	async _exec() {}
}
