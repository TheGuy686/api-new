import { EAction, Query, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class SearchOnTagsAction extends BaseAction {
	@Query({
		returnAsModel: false,
		query: (adm: ADM) => `
			SELECT s.id                                  AS id,
			       s.name                                AS title,
				   s.description                         AS description,
			       s.categoryThree                       AS category,
				   s.categoryFour                        AS subcategory,
				   s.description                         AS description,
				   s.tags                                AS tags,
				   sc.name                               AS catName,
				   sc.name                               AS catName,
				   sc.description                        AS catDescription,
				   u.id                                  AS creatorId,
				   CONCAT(u.firstName , " ", u.lastName) AS creator,
				   (CAST((
						SELECT AVG(rating) AS rating
					      FROM store_review AS sr
						 WHERE sr.storeId = s.id
					     GROUP BY sr.storeId
				   ) AS DECIMAL(11,1)))                  AS rating,
				   (CAST((
					    SELECT AVG(rating) AS rating
						  FROM store_review AS sr
					INNER JOIN store AS iis ON iis.id = sr.storeId
					     WHERE iis.createdBy = u.id
					  GROUP BY iis.createdBy
			   ) AS DECIMAL(11,1)))                  AS userRating
	          FROM store            AS s
		INNER JOIN store_categories AS sc ON s.categoryThree = sc.name
		INNER JOIN user             AS u  ON s.createdBy     = u.id
	         WHERE s.scope = 'store'
		       AND s.publishApproved = '1'
			   AND MATCH(s.tags) AGAINST(LOWER(?) IN BOOLEAN MODE)
	      GROUP BY s.categoryFour
	      ORDER BY rating, userRating DESC
		`,
		input: (adm: ADM) => [ adm.input.term ],
	})
	@Do({
		run: (adm: ADM) => {
			const out: any = {
				featured: [],
				recommended: [],
			};

			const term = adm.input.term.replace(/ /g, '-');

			for (const sm of adm.result) {
				const tags = sm.tags.split(' ');

				// this is because when we search we need to get rid
				// of the "-" and we need to weed out the partial matches
				// on phrases like "email" "service" that is not "email-service"
				if (!tags.includes(term)) continue;

				sm.rating = Number(sm.rating);
				sm.userRating = Number(sm.userRating);

				if (out.featured.length < 5) {
					out.featured.push(sm);
					continue;
				}

				out.recommended.push(sm);
			}

			adm.setResult(out);
		}
	})
	async _exec() {}
}
