import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { EAction, Do } from '@eezze/decorators';
import { LogicChain } from '@eezze/classes';

import supTypes, { FULL_RES_ITEM } from 'services/rest-store/getStoreTags/supported-tags';

const { defaults, regTypes, plainKwsTypes } = supTypes();

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class DependenciesFromTagsAction extends BaseAction {
	// first define the tags dics for easy look ups
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			

			adm.setResult({ regTypes, plainKwsTypes });
		}
	})
	// then match on the given tags and return the following three elements.
	// 	1. The matches from keyword and regex matches. These will have 
	//     the processed strings and prompt. The $1 needs replacing with the correct data
	//  2. The store based tags. These will be returned so the user can initiate store
	//     searches based on these criteria. Once a matching store module is found then
	//     that modules id and details will be added to the prompt tree for project creation
	//  3. Lastly we need to send a high level array of [unique / common] [dependencies / create prompts]
	//     that we can apply to the project if the user wants apply all. If not then each of the 
	//     dependencies and todos will have to be compiled into an array on the front end.
	@Do({
		run: async (adm: ADM, lc: LogicChain) => {
			const kws = adm.result.plainKwsTypes;
			const regs = adm.result.regTypes;

			const out: any = {
				matches: [],
				store: [],
				common: {},
			};

			const todos: any = {};
			const prompts: any = {};

			// for the common we only need to process the "manual" element of 
			// each question as these are in the case where all of them are applied.
			// This is because on the front end if the AI will manually apply them 
			// then this is the element that the information will be taken from.
			function processEntry(tag: any, match?: string) {
				// loop over each of the questions
				for (const q of tag.questions) {
					// then retrieve the "manual" answer
					const ans = q.answers.manual;
					
					// first add all the todos
					for (const td of ans.todos) {
						let tsIn = td;

						// this is the match for the regex types. ATM There is only
						// one match but as soon as there is more than one then we
						// might have to take a different approach.
						if (match) {
							tsIn = tsIn.replace(/\$1/g, match);
						}

						todos[tsIn] = true;
					}

					// then add all the prompts
					for (const p of ans.prompts) {
						let pIn = p;

						// this is the match for the regex types. ATM There is only
						// one match but as soon as there is more than one then we
						// might have to take a different approach.
						if (match) {
							pIn = pIn.replace(/\$1/g, match);
						}

						prompts[pIn] = true;
					}
				}
			}

			// Here we have to process each of the key words and make sure the all 
			// the "$1" string properties have been processed and have the full tag
			function processRegItem(item: FULL_RES_ITEM, newTag: string) {
				// first change the root tab
				item.tag = newTag;

				// then loop over each question
				for (let q of item.questions) {
					q.tag = newTag;

					// the process each possible answer for this tag
					q.answers.manual.tag = newTag;
					q.answers.store.tag = newTag;
				}

				return item;
			}

			// first loop over each of the tags supplied from the input
			tagsLoop: for (let t of (adm.input.tags ?? '').split(',')) {
				let item: any = {};

				// matched on exact tag matches
				if (typeof kws[t] == 'object') {
					item = kws[t];
					// save the matches
					out.matches.push(item);
					// process the common dependencies
					processEntry(item);
					continue tagsLoop;
				}

				// then we need to loop through each of the regex types and test the key / regex 
				// against each tag to see if we find any matches on variable tags
				for (const r in regs) {
					const reg = new RegExp(r);
					const mts = t.match(reg);
					// if we find any matches for the given regex then process the reg type and
					// then continue on this tag as there is no need to do any more processing
					if (mts) {
						item = processRegItem(regs[r], t.replace(/\$1/g, mts[1]));
						// save the matches
						out.matches.push(item);
						// process the common dependencies
						processEntry(item, mts?.[1]);
						continue tagsLoop;
					}
				}

				// if we don't find any match then we need to add that tag
				// to the store for further processing on the front end
				out.store.push({
					tag: t,
					todos: [ defaults.todos.tdAddConCreds ],
					prompts: [ defaults.prompts.queryStore ],
				});
			}

			out.common = {
				todos: Object.keys(todos),
				prompts: Object.keys(prompts)
			};
			
			adm.setResult(out);
		}
	})
	async _exec() {}
}
