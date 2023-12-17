import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import EJson from '@eezze/classes/logic/json';
import { EAction, Do } from '@eezze/decorators';
import { LogicChain } from '@eezze/classes';
import { PromptAI, EezzeClassify } from '@eezze/decorators/actions/ai';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class AskAiProjectAction extends BaseAction {
	@EezzeClassify({
		context: (adm: ADM) => 'project',
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

	// 				These are the list of services that we are currently capable of doing.

	// 				1. Rest Services
	// 				2. Websocket Services
	// 				3. MySql Database
	// 				4. File Storage
	// 				5. Email Services

	// 				Anything third party:
	// 				   1. Websocket Integration
	// 				   2. Rest API Integration

	// 				To be clear. If someone says they don't want a third party service then "smtp-mail-service" is a protocol for connecting to a third party service.

	// 				Anything that is referenced as a custom build means a combination or rest or websocket services for back end communication.
	// 				Then this will most likely require some type of database storage. And most likely some type of an authentication system.

	// 				If I give you some input can you try to understand what services it is that the user is trying to describe and can you output them in a js array of objects like this:

	// 				Possible types: mysql, rest-service, ws-service, file-storage, smtp-mail-service, ws-api-integration, rest-api-integration

	// 				{PROMPT} or "prompt" = This is a reference to the "prompt: 'create:ds:{TYPE}:{NAME}:{SERVICE-DEFINITION}'" element in the object from the js array
	// 				{TYPE} = Is an alias for the types listed above.
	// 				{NAME} = Would be what you think the user is trying to describe. This should always be pascal case for e.g "Test Project".
	// 				{SERVICE-DEFINITION} = This would be a description that you would come up with. This will be estimated and based on your understanding of what it is that they want.
	// 				{TEXT-FROM-INPUT} = This would be the segment of text from the input that would lead you to come to this "prompt" conclusion.

	// 				array = [
	// 					{
	// 						prompt: 'create:ds:{TYPE}:{NAME}:{SERVICE-DEFINITION}',
	// 					},
	// 				]

	// 				Please take into consideration that to store data, blog, emailing (local), chat anything that will potentially stored in a db will require the output to also have a database service dependency.
	// 				The goal of this output is to take into consideration all the project dependencies and we need to do the heavy thinking for them.

	// 				Also please take into consideration that these assumptions are to create an enterprise level applications.
	// 				For instance we don't store blogs in a file storage unless specified.

	// 				We need to assume the following:

	// 					1. Anything dealing with files assumes file storage
	// 					2. Sending emails assumes an emailing service unless specified otherwise
	// 					3. Any data that has to be real time should be websocket's unless the interval of data that needs to be accessed can be polled.
	// 					4. Any communication implied that needs to come from somewhere or go into our storage needs to be done via REST communication unless specified to be done via websocket's or the data needs to be real time.
	// 				    5. Any communication that needs to go outside the server / website needs to be done via third party integrations.

	// 				So if I said something like the following:

	// 				"I would like to have a blog that has a chatting system for the users.
	// 				Also I would like to have a login with facebook, gmail and linkedin function.
	// 				The website would also need to be notified of new posts in the fb group "Example Group" and then sync the information from the post to a local copy."

	// 				So, can you try to parse this information into the target format for me please?

	// 				And the last thing. Could you try to create a set of keywords from the input. So form the
	// 				above example I would compile an array of keywords that would look like this: {
	// 					// this is the eezze targeted based keywords
	// 					highLevel: [
	// 						'mysql',
	// 						'rest-service',
	// 						'ws-service',
	// 						'rest-api-integration',
	// 					],
	// 					// this is what would explain the text input on a more general level. More like categories / functions as tags.
	// 					general: [
	// 						'blog',
	// 						'facebook-login',
	// 						'gmail-login',
	// 						'linkedin-login',
	// 						'chat',
	// 						'facebook-group-posts',
	// 					]
	// 				}

	// 				Then output the response as an object like so: {
	// 					"datasources": [...],
	// 					"keywords": {
	// 						"highLevel": [...],
	// 						// try to keep these show and concise for instance "login-with-facebook" should be "facebook-login". Please also use lower case and kebab case
	// 						"general": [...]
	// 					}
	// 				}
	// 			`,
	// 		},
	// 		{
	// 			role: 'assistant',
	// 			content: `{
	// 				"message": "Sure here are the extracted information from the input. I think I understand now. You want me to put me to put my response here like this. Ok here is my response based on the test input.",
	// 				"datasources": [
	// 					{
	// 						prompt: 'create:ds:MySql:DefaultDb:A mysql type database for general site storage',
	// 					},
	// 					{
	// 						prompt: 'create:ds:rest-service:DefaultRestService:A mysql type database for general site storage',
	// 					},
	// 					{
	// 						prompt: 'create:ds:rest-api-integration:General Facebook:A third party integration that comminate with all the facebook API's',
	// 					},
	// 					{
	// 						prompt: 'create:ds:rest-api-integration:General Gmail:A third party integration that comminate with all the gmail API's',
	// 					},
	// 					{
	// 						prompt: 'create:ds:rest-api-integration:General LinkedIn:A third party integration that comminate with all the LinkedIn API's',
	// 					},
	// 					{
	// 						prompt: 'create:ds:ws-api-integration:General Websocket:A websocket server for general real time data traffic',
	// 					},
	// 				],
	// 				"keywords": {
	// 					"highLevel": [...],
	// 					"general": [
	// 						'facebook-login',  // these are for example. not "login-with-facebook"
	// 						'gmail-login',  // these are for example.
	// 						'linkedin-login',  // these are for example.
	// 						...
	// 					]
	// 				}
	// 			}`,
	// 		},
	// 		{
	// 			role: 'user',
	// 			content: `Yeah thats perfect. Now try with some actual input.`
	// 		}
	// 	],
	// 	prompt: (adm: ADM) => adm.input.prompt,
	// 	onSuccess: async (adm: ADM, lc: LogicChain) => {
	// 		const out: any = EJson.parseObject(adm.result.message);

	// 		out.keywords.general = (out?.keywords?.general).map((t: any) => {
	// 			const mts = t.match(/login-with-([a-zA-Z0-9_]+)/);

	// 			if (mts) return `${mts[1]}-login`;

	// 			return t;

	// 		});

	// 		adm.setResult(out);
	// 	},
	// })
	@Do({
		run: (adm: ADM, lc: LogicChain) => {
			adm.setResult({
				"message": "Successfully retrieved open ai response",
				"datasources": [
					{
						"prompt": "create:ds:rest-service:Blog:This is a REST service for managing a blog on the website"
					},
					{
						"prompt": "create:ds:smtp-mail-service:Emailing:This is a custom built email service for sending emails from the website"
					},
					{
						"prompt": "create:ds:rest-api-integration:Facebook:This is a third party integration for enabling login with Facebook"
					}
				],
				"keywords": {
					"highLevel": [
						"rest-service",
						"smtp-mail-service",
						"rest-api-integration"
					],
					"general": [
						"blog",
						"email-service",
						"custom-built-email-service",
						"facebook-login"
					]
				}
			});
		},
	})
	async _exec() {}
}
