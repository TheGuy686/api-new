import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { EAction, Do } from '@eezze/decorators';
import { LogicChain } from '@eezze/classes';
import { PromptAI, EezzeClassify } from '@eezze/decorators/actions/ai';
import EJson from '@eezze/classes/logic/json';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Project'
})
export default class AskAiRolesAction extends BaseAction {
	@EezzeClassify({
		context: (adm: ADM) => 'roles',
		input: (adm: ADM) => adm.input.prompt,
	})
	// @PromptAI({
	// 	apiKey: process.env['OPEN_AI_API_KEY'],
	// 	messages: [
	// 		{
	// 			role: 'user',
	// 			content: `
	// 			    ok I want you try something for me. 

	// 			    Im wanting some prompts or a list of information from some input.
				
	// 			    There can be various syntaxes. For some examples this could be a few of the syntaxes: 
	// 			    1. My website needs to have the following roles. Admin, role1 role2 and role3
	// 			    2. I want to have the following roles. Admin, role1 role2 and role3
	// 			    3. Create roles. roles. Admin, role1 role2 and role3
	// 			    4. create:role:{ROLE-NAME}
	// 			    5. create:role:{ROLE-NAME}:{ROLE-DEFINITION}
				
	// 			    if i give you some input can you try to understand what roles the user is trying to describe and can you output them in a js array like this: 
				
	// 			    array = [
	// 					'create:role:ROLE_{ROLE-NAME}(this will be the role name upper case):{ROLE-DEFINITION}',
	// 			    ]
				
	// 			    If you cant extract a "{ROLE-DEFINITION}" can you create a definition based on the context of the input? And then just replace the "{ROLE-DEFINITION}" placeholder with the created definition. 
				
	// 				note: The role name will be prefixed with "ROLE_", followed by the role name in upper case under score case.

	// 			    So the output should look something like this "const rolesArray = [
	// 					'create:role:ROLE_ADMIN:Full access and control over website functionalities and settings.'
	// 			    ];"

	// 				Your entires response can you output it as a json object. So response as follows:

	// 				ok try and example for the following prompt "for my website it will need an admin, user and a manager role"
	// 			`,
	// 		},
	// 		{
	// 			role: 'assistant',
	// 			content: `{
	// 				"message": "Sure here are the extracted Roles from the input. I understand now. You want me to put me to put my response here like this. Ok can you give me some test input.",
	// 				"roles": [
	// 					"create:role:ROLE_ADMIN:Full access and control over website functionalities and settings.",
	// 					"create:role:ROLE_USER:Standard user access.",
	// 					"create:role:ROLE_MANAGER:Managerial access for overseeing operations."
	// 				]
	// 			}`,
	// 		}
	// 	],
	// 	prompt: (adm: ADM) => adm.input.prompt,
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		const obj: any = EJson.parseObject(adm.result.message);

	// 		// lc.stash.assign.object('aiRoles', obj);

	// 		// await lc.result();

	// 		adm.setResult(obj?.roles ?? []);
	// 	}
	// })
	@Do({
		run: (adm: ADM, lc: LogicChain) => {
			adm.setResult([
				"create:role:ROLE_ADMIN:Full access and control over website functionalities and settings.",
				"create:role:ROLE_USER:Standard user access.",
				"create:role:ROLE_MANAGER:Managerial access for overseeing operations.",
				"create:role:ROLE_HR:Access to HR-related functionalities.",
				"create:role:ROLE_ACCOUNT:Access to account management functionalities.",
				"create:role:ROLE_GUEST:Limited access for guests.",
				"create:role:ROLE_CLIENT:Access for clients.",
			]);
		},
	})
	async _exec() {}
}
