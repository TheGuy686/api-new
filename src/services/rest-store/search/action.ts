import { EAction, Query } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class SearchAction extends BaseAction {
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
				   ) AS DECIMAL(11,1)))                  AS rating,
				   (CAST((
					SELECT AVG(rating) AS rating
					  FROM store_review AS sr
				INNER JOIN store AS iis ON iis.id = sr.storeId
					 WHERE iis.createdBy = u.id
				  GROUP BY iis.createdBy
		   ) AS DECIMAL(11,1)))                          AS userRating
	          FROM store            AS store
		INNER JOIN store_categories AS sc ON store.categoryThree = sc.name
	    INNER JOIN user             AS u  ON store.createdBy     = u.id
	         WHERE store.scope = 'store'
		       AND store.publishApproved = '1'
			   AND (
						LOWER(store.categoryThree) LIKE LOWER(?) OR
						LOWER(store.categoryFour)  LIKE LOWER(?) OR
						LOWER(store.name)          LIKE LOWER(?) OR
						MATCH(store.description) AGAINST(LOWER(?) IN BOOLEAN MODE)
				   )
	      GROUP BY store.categoryFour
	      ORDER BY store.categoryThree ASC
		`,
		input: (adm: ActionDataManager) => [
			`%${adm.input.term}%`,
			`%${adm.input.term}%`,
			`%${adm.input.term}%`,
			adm.input.term,
		],
	})
	async _exec() {}
}
