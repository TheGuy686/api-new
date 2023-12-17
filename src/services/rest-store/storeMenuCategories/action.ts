import { EAction, Query, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class StoreMenuCategoriesAction extends BaseAction {
	@Query({
		returnAsModel: false,
		query: (adm: ActionDataManager) => `
				SELECT store.categoryThree AS category,
					   store.categoryFour  AS subcategory,
					   sc.name             AS catName,
					   sc.description      AS catDescription,
					   store.name          AS subcName,
					   store.description   AS subcDescription
				  FROM store            AS store
			 LEFT JOIN store_categories AS sc ON store.categoryThree = sc.name
				 WHERE store.scope = 'store'
				   AND store.publishApproved = '1'
			  GROUP BY store.categoryFour
			  ORDER BY store.categoryThree ASC
	`,
	})
	@Do({
		run: (adm: ActionDataManager) => {
			const menu: any = {};

			for (const r of adm.result) {
				if (typeof menu[r.category] == 'undefined') {
					menu[r.category] = {
						key: kebabCase(r.category),
						name: r.category,
						description: r.catDescription,
						children: [],
					};
				}

				menu[r.category].children.push({
					key: r.subcategory,
					name: r.subcName,
					description: r.subcDescription,
				});
			}

			adm.setResult(Object.values(menu));
		}
	})
	async _exec() {}
}
