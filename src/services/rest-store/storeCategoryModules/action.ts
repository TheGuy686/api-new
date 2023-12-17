import { EAction, Query, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class StoreCategoryModulesAction extends BaseAction {
	@Query({
		returnAsModel: false,
		query: (adm: ActionDataManager) => `
			SELECT store.id                              AS id,
				   store.categoryThree                   AS category,
				   store.categoryFour                    AS subcategory,
				   sc.name                               AS catName,
				   sc.description                        AS catDescription,
				   store.name                            AS subcName,
				   store.description                     AS subcDescription,
				   u.id                                  AS creatorId,
				   CONCAT(u.firstName , " ", u.lastName) AS creator,
				   (CAST((
						SELECT AVG(rating) AS rating
					      FROM store_review AS sr
						 WHERE sr.storeId = store.id
					     GROUP BY sr.storeId
				   ) AS DECIMAL(11,1)))                  AS rating
	          FROM store            AS store
	     LEFT JOIN store_categories AS sc ON store.categoryThree = sc.name
	     LEFT JOIN user             AS u  ON store.createdBy     = u.id
	         WHERE store.scope = 'store'
		       AND store.publishApproved = '1'
			   AND LOWER(store.categoryThree) = LOWER(?)
			   AND LOWER(store.categoryFour)  = LOWER(?)
	      GROUP BY store.categoryFour
	      ORDER BY store.categoryThree, rating ASC
		`,
		input: (adm: ActionDataManager) => [ adm.input.category, adm.input.subcategory ],
	})
	async _exec() {}
}
