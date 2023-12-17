import { EAction, GetOne, Do } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.StoreRepo',
})
export default class ReadStoreAction extends BaseAction {
	@GetOne({
		checkOn: [ 'id' ],
		input: (adm: ActionDataManager) => ({ id: adm.input.id })
	})
	// @Do({
	// 	run: (adm: ActionDataManager) => {
	// 		adm.setResult({
	// 			"createdBy": 1,
	// 			"name": "POSTGRES Test",
	// 			"description": "A POSTGRES Module Description",
	// 			"metadata": {},
	// 			"scope": "store",
	// 			"categoryThree": "databases",
	// 			"categoryFour": "postgres",
	// 			"version": 1,
	// 			"active": true,
	// 			"required": true,
	// 			"shortFunction": [
	// 				"this product does a",
	// 				"This product does b",
	// 				"This product does c"
	// 			],
	// 			"sgFunction": [
	// 				"The function of this product is to do a",
	// 				"and to do b",
	// 				"and to do c"
	// 			],
	// 			"allServiceIds": [
	// 				1, 2, 3,
	// 			],
	// 			"serviceGroups": [
	// 				{
	// 					"name": "Final Test Group",
	// 					"description": "This is going to be used as a publish store test",
	// 					"type": "custom",
	// 					"metadata": {},
	// 					"services": [
	// 						{
	// 							"id": 1,
	// 							"type": "rest",
	// 							"name": "Test service 1",
	// 							"description": "Test",
	// 							"definition": "{\"path\":\"test\",\"roles\":[2,6],\"method\":\"get\"}",
	// 							"actionInput": "[]",
	// 							"selected": true,
	// 							"logic": `[{\"id\":\"84\",\"name\":\"Action #1\",\"type\":\"text\",\"isNew\":true,\"output\":[],\"schema\":{\"repo\":\"\",\"input\":[{\"id\":\"EPu3FpXCWi\",\"raw\":\"adm.request.method\",\"desc\":\"This is mapped value & logic for property email\",\"name\":\"Propery \\\"email\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"email\"}],\"entity\":12,\"_action\":{\"action\":\"get-one-and-update\",\"category\":\"database\"},\"checkOn\":[\"email\"],\"datasource\":1,\"maximumDepth\":4},\"errorCode\":400,\"description\":\"Action #1 Description\",\"successCode\":200,\"errorMessage\":\"Error message\",\"successMessage\":\"Success message\"},{\"id\":\"47\",\"name\":\"Action #2\",\"type\":\"text\",\"isNew\":true,\"output\":[],\"schema\":{\"repo\":\"DefaultMysqlDB.Default\",\"linter\":\"babel\",\"_action\":{\"action\":\"save\",\"category\":\"files\"},\"fileName\":{\"id\":\"rlDkFjLQJL\",\"raw\":\"adm.request.fullUrl\",\"desc\":\"This is mapped value & logic for property fileName\",\"name\":\"Propery \\\"fileName\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"fileName\"},\"template\":2,\"datasource\":1,\"templateVars\":[{\"id\":\"VsskYKhEa9\",\"raw\":\"adm.request.fullUrl\",\"desc\":\"This is mapped value & logic for property ryan\",\"name\":\"Propery \\\"ryan\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"ryan\"}]},\"errorCode\":400,\"description\":\"Action #2 Description\",\"successCode\":200,\"errorMessage\":\"Error message\",\"successMessage\":\"Success message\"},{\"id\":\"36\",\"name\":\"Action #3\",\"type\":\"text\",\"isNew\":true,\"output\":[],\"schema\":{\"to\":{\"id\":\"I7GlDq3MdC\",\"raw\":\"ry@emaill.co\",\"desc\":\"This is mapped value & logic for property to\",\"name\":\"Propery \\\"to\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"primitive\",\"property\":\"to\"},\"from\":{\"id\":\"ARSt1RbW4P\",\"raw\":\"Ryan Cooke\",\"desc\":\"This is mapped value & logic for property from\",\"name\":\"Propery \\\"from\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"primitive\",\"property\":\"from\"},\"repo\":\"RolfsDemoDB.Default\",\"_action\":{\"action\":\"send-smtp-email\",\"category\":\"email\"},\"subject\":{\"id\":\"LU7LElZyix\",\"raw\":\"adm.request.fullUrl\",\"desc\":\"This is mapped value & logic for property subject\",\"name\":\"Propery \\\"subject\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"subject\"},\"template\":1,\"datasource\":3,\"templateVars\":[{\"id\":\"0DRl8llWwt\",\"raw\":\"adm.request.method\",\"desc\":\"This is mapped value & logic for property asdf\",\"name\":\"Propery \\\"asdf\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"asdf\"}]},\"errorCode\":400,\"description\":\"Action #3 Description\",\"successCode\":200,\"errorMessage\":\"Error message\",\"successMessage\":\"Success message\"},{\"id\":\"92\",\"name\":\"Action #4\",\"type\":\"text\",\"isNew\":true,\"output\":[],\"schema\":{\"repo\":\"\",\"input\":[{\"id\":\"nvHggDuzWK\",\"raw\":\"adm.request.fullUrl\",\"desc\":\"This is mapped value & logic for property email\",\"name\":\"Propery \\\"email\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"email\"}],\"entity\":1,\"_action\":{\"action\":\"delete-one\",\"category\":\"database\"},\"checkOn\":[\"email\"],\"datasource\":3},\"errorCode\":400,\"description\":\"Action #4 Description\",\"successCode\":200,\"errorMessage\":\"Error message\",\"successMessage\":\"Success message\"}]`,
	// 							"output": "[]"
	// 						},
	// 						{
	// 							"id": 2,
	// 							"type": "websocket",
	// 							"name": "A Websocket",
	// 							"description": "This is a websocket description",
	// 							"definition": "{\"roles\":[3],\"direction\":\"incoming\",\"eventName\":\"thisIsAnEventName\"}",
	// 							"actionInput": "[]",
	// 							"logic": `[{\"id\":\"73\",\"name\":\"Action #1\",\"type\":\"text\",\"isNew\":true,\"output\":[],\"schema\":{\"repo\":\"DefaultMysqlDB.Default\",\"input\":{\"id\":\"Aooj7Y9W4W\",\"raw\":\"adm.request.method\",\"desc\":\"This is mapped value & logic for property input\",\"name\":\"Propery \\\"input\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"input\"},\"_action\":{\"action\":\"command\",\"category\":\"misc\"},\"datasource\":1,\"rootFolder\":{\"id\":\"oLlFE8QrzR\",\"raw\":\"adm.request.host\",\"desc\":\"This is mapped value & logic for property rootFolder\",\"name\":\"Propery \\\"rootFolder\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"rootFolder\"},\"runAsynchronous\":true},\"errorCode\":400,\"description\":\"Action #1 Description\",\"successCode\":200,\"errorMessage\":\"Error message\",\"successMessage\":\"Success message\"}]`,
	// 							"output": "[]",
	// 							"selected": true
	// 						}
	// 					]
	// 				},
	// 				{
	// 					"name": "Test Service 2",
	// 					"description": "asdfasdf",
	// 					"type": "custom",
	// 					"metadata": {},
	// 					"services": [
	// 						{
	// 							"id": 3,
	// 							"type": "websocket",
	// 							"name": "asdfads",
	// 							"description": "fasdf",
	// 							"definition": "{\"roles\":[3],\"direction\":\"incoming\",\"eventName\":\"afdasdf\"}",
	// 							"actionInput": "[]",
	// 							"logic": `[{\"id\":\"29\",\"name\":\"Action #1\",\"type\":\"text\",\"isNew\":false,\"output\":[],\"schema\":{\"repo\":\"Dfghdfgh.Default\",\"input\":{\"id\":\"kApRmmnfPT\",\"raw\":\"adm.request.method\",\"desc\":\"This is mapped value & logic for property input\",\"name\":\"Propery \\\"input\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"input\"},\"_action\":{\"action\":\"command\",\"category\":\"misc\"},\"datasource\":4,\"rootFolder\":{\"id\":\"8MALMJ00OO\",\"raw\":\"adm.request.host\",\"desc\":\"This is mapped value & logic for property rootFolder\",\"name\":\"Propery \\\"rootFolder\\\" mapping\",\"type\":\"text\",\"actions\":[],\"example\":\"\",\"baseType\":\"context-mapping\",\"property\":\"rootFolder\"},\"runAsynchronous\":true},\"errorCode\":400,\"description\":\"Action #1 Description\",\"successCode\":200,\"errorMessage\":\"Error message\",\"successMessage\":\"Success message\"}]`,
	// 							"output": "[]",
	// 							"selected": true
	// 						}
	// 					]
	// 				}
	// 			],
	// 			"connections": [
	// 				{
	// 					"name": "Riches Server",
	// 					"description": "This is just a normal server",
	// 					"type": "server",
	// 					"metadata": `{\"auth\":{\"type\":\"basic\",\"props\":{\"user\":\"root\",\"password\":\"password\"},\"credentials\":1},\"host\":\"http://localhost\",\"port\":\"8080\",\"serviceTypes\":[\"rest\",\"websocket\",\"cron-task\",\"installable-services\"]}`
	// 				}
	// 			],
	// 			"vault": [
	// 				{
	// 					"name": "A Vault Demo",
	// 					"description": "This is just another vault",
	// 					"accessibleTo": "[2]",
	// 					"updatableTo": "[2,3,6]",
	// 					"keyValues": "[\n    {\n        \"key\": \"root\",\n        \"value\": \"\",\n        \"isSecret\": false\n    },\n    {\n        \"key\": \"password\",\n        \"value\": \"\",\n        \"isSecret\": true\n    }\n]",
	// 					"createdAt": '2023-02-22T17:17:37.000Z',
	// 					"updatedAt": '2023-02-22T17:19:08.000Z',
	// 					"active": 1
	// 				}
	// 			],
	// 			"valueStore": [],
	// 			"serviceConfigs": [
	// 				{
	// 					"name": "Forgot Password Email",
	// 					"description": "This is just a test email template",
	// 					"type": "email",
	// 					"metadata": `{\"md\":\"# Yeah this is just some kind of file template\\n\\nhello there \\n\\n# bla bla\\n\\n|column1|column2|column3|\\n|-|-|-|\\n|content1|content2|content3|\\n\",\"raw\":\"# Yeah this is just some kind of file template\\n\\nhello there \\n\\n# bla bla\\n\\n|column1|column2|column3|\\n|-|-|-|\\n|content1|content2|content3|\\n\",\"html\":\"<style>.hljs {\\n    color: hsl(210,8%,15%) !important;\\n    padding: 0px 10px 20px 10px !important;\\n    background-color: hsl(0,0%,96.5%) !important;\\n}\\n\\n.eezze-table td {\\n    border: 1px solid #dfe2e5;\\nbox-sizing: border-box;\\n    padding-top: 6px;\\n    padding-left: 13px;\\n    padding-right: 13px;\\n    padding-bottom: 6px;\\n}\\n\\n.eezze-h1 {\\n    color: #b63333;\\n    font-size: 24px;\\n    border-top: solid #000000 4px;\\nfont-weight: bold;\\n    border-bottom: solid #eaecef 8px;\\n    padding-bottom:   5em;\\n    border-bottom-left-radius: 12px;\\n    border-left: solid #000000 6px;\\n    border-right: solid #000000 8px;\\n}\\n\\n.eezze-h2 {\\n    font-size: 1.5em;\\n    border-bottom: 1px solid #eaecef;\\n    padding-bottom: 0.3em;\\n}\\n\\n.eezze-h3 {\\n    font-size: 1.25em;\\n}\\n\\n.eezze-h4 {\\n    font-size: 1em;\\n}\\n\\n.eezze-h5 {\\n    font-size: .875em;\\n}\\n\\n.eezze-h6{\\n    color: #6a737d;\\n    font-size: .85em;\\n}\\n\\n.eezze-ol {\\n    margin-left: 15px;\\n    list-style-type: decimal;\\n    list-style-position: inside;\\n}\\n\\n.eezze-ul {\\n    margin-left: 15px;\\n    list-style-type: disc;\\n    list-style-position: inside;\\n}\\n\\n.hljs-left {\\n    text-align: left;\\n}\\n\\nblockquote {\\n    color: #6a737d;\\n    padding: 0 1em;\\n    border-left: 0.25em solid #dfe2e5;\\n}\\n\\n.hljs-right {\\n    text-align: right;\\n}\\n\\n.hljs-center {\\n    text-align: center;\\n}\\n\\n.eezze-table th {\\n    border: 1px solid #dfe2e5;\\n    box-sizing: border-box;\\n    font-weight: 600;\\n    padding-top: 6px;\\n    padding-left: 13px;\\n    padding-right: 13px;\\n    padding-bottom: 6px;\\n}\\n\\n\\n</style><h1 id=\\\"yeah-this-is-just-some-kind-of-file-template\\\" class=\\\"eezze-h1\\\">Yeah this is just some kind of file template</h1><br /><p>hello there </p><br /><h1 id=\\\"bla-bla\\\" class=\\\"eezze-h1\\\">bla bla</h1><br /><table class=\\\"eezze-table\\\"><thead><tr><th>column1</th><th>column2</th><th>column3</th></tr></thead><tbody><tr><td>content1</td><td>content2</td><td>content3</td></tr></tbody></table><br />\",\"template\":\"forgot-password.etz\",\"templates\":{\"forgot-password.etz\":\"# Yeah this is just some kind of file template\\n\\nhello there \\n\\n# bla bla\\n\\n|column1|column2|column3|\\n|-|-|-|\\n|content1|content2|content3|\\n\"},\"templateVars\":{\"forgot-password.etz\":{}},\"templateStyles\":{\".hljs\":{\"key\":\"code\",\"style\":{\"color\":\"hsl(210,8%,15%) !important\",\"padding\":\"0px 10px 20px 10px !important\",\"background-color\":\"hsl(0,0%,96.5%) !important\"},\"prefix\":\".hljs\"},\"table td\":{\"key\":\"td\",\"style\":{\"border\":\"1px solid #dfe2e5\",\"box-sizing\":\"border-box\",\"padding-top\":\"6px\",\"padding-left\":\"13px\",\"padding-right\":\"13px\",\"padding-bottom\":\"6px\"},\"prefix\":\".eezze-table td\"},\".eezze-h1\":{\"key\":\"heading-1\",\"style\":{\"color\":\"#b63333\",\"font-size\":\"24px\",\"border-top\":\"solid #000000 4px\",\"border-left\":\"solid #000000 6px\",\"font-weight\":\"bold\",\"border-right\":\"solid #000000 8px\",\"border-bottom\":\"solid #eaecef 8px\",\"padding-bottom\":\"  5em\",\"border-bottom-left-radius\":\"12px\"},\"prefix\":\".eezze-h1\"},\".eezze-h2\":{\"key\":\"heading-2\",\"style\":{\"font-size\":\"1.5em\",\"border-bottom\":\"1px solid #eaecef\",\"padding-bottom\":\"0.3em\"},\"prefix\":\".eezze-h2\"},\".eezze-h3\":{\"key\":\"heading-3\",\"style\":{\"font-size\":\"1.25em\"},\"prefix\":\".eezze-h3\"},\".eezze-h4\":{\"key\":\"heading-4\",\"style\":{\"font-size\":\"1em\"},\"prefix\":\".eezze-h4\"},\".eezze-h5\":{\"key\":\"heading-5\",\"style\":{\"font-size\":\".875em\"},\"prefix\":\".eezze-h5\"},\".eezze-h6\":{\"key\":\"heading-6\",\"style\":{\"color\":\"#6a737d\",\"font-size\":\".85em\"},\"prefix\":\".eezze-h6\"},\".eezze-ol\":{\"key\":\"ol\",\"style\":{\"margin-left\":\"15px\",\"list-style-type\":\"decimal\",\"list-style-position\":\"inside\"},\"prefix\":\".eezze-ol\"},\".eezze-ul\":{\"key\":\"ul\",\"style\":{\"margin-left\":\"15px\",\"list-style-type\":\"disc\",\"list-style-position\":\"inside\"},\"prefix\":\".eezze-ul\"},\".hljs-left\":{\"key\":\"text-align-left\",\"style\":{\"text-align\":\"left\"},\"prefix\":\".hljs-left\"},\"blockquote\":{\"key\":\"blockquote\",\"style\":{\"color\":\"#6a737d\",\"padding\":\"0 1em\",\"border-left\":\"0.25em solid #dfe2e5\"},\"prefix\":\"blockquote\"},\".hljs-right\":{\"key\":\"text-align-right\",\"style\":{\"text-align\":\"right\"},\"prefix\":\".hljs-right\"},\".hljs-center\":{\"key\":\"text-align-center\",\"style\":{\"text-align\":\"center\"},\"prefix\":\".hljs-center\"},\".eezze-table th\":{\"key\":\"th\",\"style\":{\"border\":\"1px solid #dfe2e5\",\"box-sizing\":\"border-box\",\"font-weight\":600,\"padding-top\":\"6px\",\"padding-left\":\"13px\",\"padding-right\":\"13px\",\"padding-bottom\":\"6px\"},\"prefix\":\".eezze-table th\"}}}`,
	// 					"active": 1
	// 				}
	// 			],
	// 			"roles": [
	// 				{
	// 					"role": "RYAN_2_AGAIN_2",
	// 					"description": "This is just a another role to test",
	// 					"active": 1
	// 				}
	// 			],
	// 			"datasources": [
	// 				{
	// 					"type": "Mysql",
	// 					"name": "Default Mysql DB",
	// 					"metadata": "{\"configuration\":1,\"dbName\":\"eezze db 2\",\"host\":\"localhost\",\"port\":8080,\"user\":\"root\",\"password\":\"password\",\"credentials\":1,\"connection\":2,\"secure\":true,\"protocol\":\"http\",\"secureProtocol\":\"https\",\"localhost\":\"localhost\",\"logger\":5}\",\"initModel\": \"[{\"id\":12,\"name\":\"hello_ther\",\"type\":\"dbTable\",\"input\":{},\"output\":{},\"modules\":[{\"id\":13,\"name\":\"something\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{\"23\":{\"data\":{\"type\":\"m:n\"},\"entity_id\":23},\"25\":{\"data\":{\"type\":\"n:1\"},\"entity_id\":25}},\"key_key\":true,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":true,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":true,\"model_ignore\":false,\"model_required\":false},{\"id\":15,\"name\":\"dadsfads\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{},\"key_key\":false,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":false,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":false,\"model_ignore\":false,\"model_required\":false},{\"id\":16,\"name\":\"dsf\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{},\"key_key\":false,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":false,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":false,\"model_ignore\":false,\"model_required\":false},{\"id\":17,\"name\":\"afr4353\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{},\"key_key\":false,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":false,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":false,\"model_ignore\":false,\"model_required\":false},{\"id\":18,\"name\":\"234234\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{},\"key_key\":false,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":false,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":false,\"model_ignore\":false,\"model_required\":false},{\"id\":19,\"name\":\"23234\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{},\"key_key\":false,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":false,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":false,\"model_ignore\":false,\"model_required\":false}],\"position\":{\"x\":75,\"y\":175}}]"
	// 				},
	// 				{
	// 					"type": "Mysql",
	// 					"name": "Rolfs Demo DB",
	// 					"metadata": `{\"credentials\":1,\"user\":\"root\",\"password\":\"password\",\"configuration\":1,\"dbName\":\"adfasdf\",\"host\":\"asdfasdf\",\"port\":5050}`,
	// 					"initModel": `[{\"id\":1,\"name\":\"something\",\"type\":\"dbTable\",\"input\":{},\"output\":{},\"modules\":[{\"id\":2,\"name\":\"bla_bla\",\"type\":\"dbColumn\",\"input\":{},\"length\":\"\",\"output\":{},\"key_key\":false,\"dataType\":\"CHAR\",\"position\":null,\"unsigned\":false,\"zerofill\":false,\"allow_null\":false,\"key_unique\":false,\"key_primary\":false,\"key_spatial\":false,\"key_fulltext\":false,\"model_ignore\":false,\"model_required\":false}],\"position\":{\"x\":25,\"y\":25}}]`
	// 				},
	// 				{
	// 					"type": "Mysql",
	// 					"name": "dfghdfgh",
	// 					"metadata": "{\"configuration\":1,\"credentials\":1,\"user\":\"root\",\"password\":\"password\"}",
	// 					"initModel": "[]"
	// 				}
	// 			],
	// 		});
	// 	}
	// })
	async _exec() {}
}
