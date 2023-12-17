import { EAction, Query, ServiceCaller, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class AllInternalModulesAction extends BaseAction {
	@ServiceCaller({
        service: 'RestProjectsService:allProjects',
        headers: (adm: ADM) => ({
			authorization: adm.request.auth.idToken,
		}),
		onSuccess: (adm: ADM) => {
			const out: any[] = [];

			for (const pr of adm.result) out.push(pr.id);

			adm.setResult(out);
		},
	})
	@Query({
		repo: 'Mysql.StoreRepo',
		query: (adm: ADM) => {
			return `
				 SELECT store.id              AS StoreModel_id,
			            store.srcProjectId    AS StoreModel_srcProjectId,
					    store.name            AS StoreModel_name,
						store.description     AS StoreModel_description,
						store.scope           AS StoreModel_scope,
						store.type            AS StoreModel_type,
						store.shortFunction   AS StoreModel_shortFunction,
						store.sgFunction      AS StoreModel_sgFunction,
						store.publishApproved AS StoreModel_publishApproved,
						store.categoryOne     AS StoreModel_categoryOne,
						store.categoryTwo     AS StoreModel_categoryTwo,
						store.categoryThree   AS StoreModel_categoryThree,
						store.categoryFour    AS StoreModel_categoryFour,
						store.categoryFive    AS StoreModel_categoryFive,
						store.categorySix     AS StoreModel_categorySix,
						store.version         AS StoreModel_version,
						store.active          AS StoreModel_active
                   FROM store store
                  WHERE store.scope = 'internal'
				    AND store.srcProjectId IN(${adm.result.length > 0 ? adm.result.join(', ') : "''"})
					AND ${adm.result.length > 0}
			`;
		}
	})
	async _exec() {}
}
