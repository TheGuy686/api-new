import { EAction, Do, ServiceCaller, CreateOne, Query } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import { ESet } from '@eezze/classes/logic';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreServiceGroupRepo',
})
export default class PublishServGroupAction extends BaseAction {
	@Query({
		query: (adm: ADM, lc: LogicChain) => `
			SELECT *
			  FROM store_service_group
			 WHERE srcId IN(${adm.input.serviceGroups})
		`,
		failOn: [
			{
				condition: (adm: ADM, lc: LogicChain) => adm.result.length > 0,
				message: (adm: ADM, lc: LogicChain) => {
					let ids: any[] = [];

					for (const res of adm.result) ids.push(res.srcId);

					return `Service group ids "${ids.join(', ')}" were already published to the app / template store`;
				},
			},
		],
	})
	@ServiceCaller({
		service: 'RestServsGroupsService:transformSgToStoreSg',
		actionListSource: (adm: ADM) => adm.input.serviceGroups,
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		urlParams: (adm: ADM, lc: LogicChain, item: any) => ({ id: item }),
	})
	@Do({
		run: (adm: ADM) => {
			let connections: any = {};
			let vault: any = {};
			let valueStore: any = {};
			let serviceConfigs: any = {};
			let roles: any = {};
			let datasources: any = {};

			const overrides = EJson.parseObject(adm.input?.overrides ?? {});

			const servStoryDict: any = overrides?.serviceStories ?? {};

			const stories: string [] = [];

			const sgs: any[] = [];

			for (const res of adm.result) {
				let con: any, val: any, vlt: any, sc: any, rle: any, ds: any;

				for (con of res?.connections ?? []) {
					if (typeof connections[con?.name] != 'undefined') continue;
					con.createdBy = adm.input.createdBy;
					connections[con?.name] = con;
				}

				for (vlt of res?.vault ?? []) {
					if (typeof vault[vlt?.name] != 'undefined') continue;
					vlt.createdBy = adm.input.createdBy;
					vault[vlt?.name] = vlt;
				}

				for (val of res?.valueStore ?? []) {
					if (typeof valueStore[val?.name] != 'undefined') continue;
					sc.createdBy = adm.input.createdBy;
					valueStore[val?.name] = val;
				}

				for (sc of res?.serviceConfigs ?? []) {
					if (typeof serviceConfigs[sc?.name] != 'undefined') continue;
					sc.createdBy = adm.input.createdBy;
					serviceConfigs[sc?.name] = sc;
				}

				for (rle of res?.roles ?? []) {
					if (typeof roles[rle?.name] != 'undefined') continue;
					rle.createdBy = adm.input.createdBy;
					roles[rle?.name] = rle;
				}

				for (ds of res?.datasources ?? []) {
					if (typeof datasources[ds?.name] != 'undefined') continue;
					ds.createdBy = adm.input.createdBy;
					datasources[ds?.name] = ds;
				}

				const sgStories: string[] = [];

				// remember to delete this
				for (let s of res.serviceGroup.services) {
					s.createdBy = adm.input.createdBy;
					s.logic = JSON.parse(s.logic);

					if (typeof servStoryDict[s.name] == 'object') {
						s.story = servStoryDict[s.name];
					}
					else {
						s.story = {
							who: '',
							what: '',
							why: '',
						};
					}

					s.fullStory = `As a / an "${s.story.who}", ${s.story.what}. ${s.story.why}`;

					sgStories.push(s.fullStory);

					stories.push(s.fullStory);
				}

				res.serviceGroup.stories = sgStories.join('\n');
				res.serviceGroup.createdBy = adm.input.createdBy;

				sgs.push(res.serviceGroup);
			}

			try {
				const store: any = {
					srcProjectId: adm.input.projectId,
					createdBy: adm.input.createdBy,
					publishedBy: adm.request.auth.user.id,
					name: adm.input?.name,
					description: adm.input?.description,
					metadata: adm.input?.metadata ?? {},
					scope: adm.input?.scope,
					type: adm.input?.type,
					categoryThree: adm.input?.category,
					categoryFour: adm.input?.subcategory,
					version: adm.input?.version ?? 1.0,
					active: adm.input?.active ?? true,
					required: true,
					shortFunction: adm.input?.shortFunction.split('\n'),
					sgFunction: adm.input?.sgFunction.split('\n'),
					serviceGroups: sgs,
					tags: adm.input?.tags ?? '',
					stories: stories. join('\n'),
					connections: Object.values(connections),
					vault: Object.values(vault),
					valueStore: Object.values(valueStore),
					serviceConfigs: Object.values(serviceConfigs),
					roles: Object.values(roles),
					datasources: Object.values(datasources),
					reviews: [],
				};

				ESet(adm.stash, 'store' , store);
			}
			catch (err) { return {} }
		}
	})
	@CreateOne({
		repo: 'Mysql.StoreRepo',
		maximumDepth: 10,
		input: (adm: ADM) => adm.stash.store,
	})
	async _exec() {}
}