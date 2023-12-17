import { EAction, Do, PromptAI, EezzeClassify } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

import supTypes from 'services/rest-store/getStoreTags/supported-tags';
import EJson from '@eezze/classes/logic/json';

const { keywords } = supTypes();

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GetStoreTagsAction extends BaseAction {
	// @EezzeClassify({
	// 	context: (adm: ADM) => 'project',
	// 	input: (adm: ADM) => adm.input.functionDesc,
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		lc.stash.assign.text('functionDesc', adm.result.join(''));
	// 		await lc.result();
	// 	},
	// })
	// @EezzeClassify({
	// 	context: (adm: ADM) => 'project',
	// 	input: (adm: ADM) => adm.input.bulletPointDesc,
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		lc.stash.assign.text('bulletPointDesc', adm.result.join(''));
	// 		await lc.result();
	// 	},
	// })
	// @PromptAI({
	// 	apiKey: process.env['OPEN_AI_API_KEY'],
	// 	messages: [
	// 		{
	// 			role: 'user',
	// 			content: `
	// 			    What I would like you to do is this.

	// 				We are trying to get a set of tags from a high level functional description.
	// 				This will allow us to do better querying based on a basic description.

	// 				Here is a list of all the supported keywords. Please keep in mind that we also support
	// 				variable / regex based keywords, for e.g. "([a-zA-Z0-9_]+)-login" would be "facebook-login"
	// 				in the tags output. Please try to use an many existing one as possible but crate new ones
	// 				where ever it makes sense.

	// 				Supported keywords: "${keywords.join(', ')}"

	// 				So here is some example input:

	// 				Functional description:

	// 					"This service is an authentication service that will include all the different services required to log in and manage their account. The user will be able to register, login, update their account, and do other account-related activities."

	// 				Bullet point description:

	// 					"login
	// 					register
	// 					refresh login token
	// 					get user information
	// 					manage emails for forgot password and other account notifications
	// 					upload and edit user avatar
	// 					deal with account verification"

	// 				You will conclude the output based on a high level general description of the site and a bullet point description of the functionality.

	// 				Try to output that as a json object. Any message that you want to articulate to me
	// 				please put that in the "message" property of the json output and the keywords into the "keyword" property.

	// 				These are just some general notes. Functions like image gallery management can be broken up into multiple
	// 				tags, for e.g: "product-image-gallery-management" would be "image-uploading", "image-deleting", "image-reading".
	// 				Try to consider these tags as very general descriptions of what a website would need to make these
	// 				high level functions to actually function.
	// 			`,
	// 		},
	// 		{
	// 			role: 'assistant',
	// 			content: `{
	// 				"message": "So you want me to output the response like this correct? And inset the processed keywords in the response like this correct?",
	// 				"keywords": [
	// 					"authentication",
	// 					"user-login",
	// 					"user-registration",
	// 					"auth-token-refresh",
	// 					"get-user-info",
	// 					"email-sending",
	// 					"reset-password-email",
	// 					"forgot-password-email",
	// 					"verify-account",
	// 					"verify-account-email",
	// 					"file-upload", // this is for the user avatar
	// 					"file-delete", // this is for the user avatar
	// 					"read-delete", // this is for the user avatar
	// 					"update-account",
	// 					"suspicious-account-activity-email",
	// 					"account-locking"
	// 				]
	// 			}`,
	// 		},
	// 		{
	// 			role: 'user',
	// 			content: `Yeah thats perfect. Now try with some actual input.`
	// 		}
	// 	],
	// 	prompt: (adm: ADM, lc: LogicChain) => `
	// 		Functional description:

	// 			${lc.stash.prop('functionDesc')}

	// 		Bullet point description:

	// 			${lc.stash.prop('bulletPointDesc')}
	// 	`,
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		const out: any = EJson.parseObject(adm.result.message);

	// 		adm.setResult(out.keywords);
	// 	},
	// })
	@Do({
		run: (adm: ADM, lc: LogicChain) => {
			adm.setResult([
				'e-commerce',
				'store-management',
				'app-store',
				'item-listing',
				'item-bidding',
				'product-management',
				'new-listings',
				'most-popular-features',
				'product-promotions',
				'product-image-gallery-management'
			  ]
			);
		},
	})
	async _exec() {}
}
