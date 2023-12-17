export default {
	"projectId": -1,
	"serviceGroupId": -1,
	"type":"websocket",
	"name":"Project Logs",
	"description":"This is the event that will relay all the logs of this project to the Eezze platform UI",
	"definition":{
		"channel":{
			"id":"bX3MJZHNLo",
			"raw":"",
			"desc":"This is mapped value & logic for property channel",
			"name":"Propery \"channel\" mapping",
			"type":"text",
			"actions":[
				{
					"id":"lHc6WxwS5C",
					"name":"Action 1",
					"type":"string",
					"actions":[
						{
							"id":"i7cfuN03q9",
							"name":"Logic item \"0\"",
							"type":"custom",
							"logic":{
								"raw":"return `pr-${adm.input.projectId}`;",
								"prop":"",
								"type":"",
								"opArgs":[
									
								],
								"source":"",
								"formula":"",
								"subtype":"",
								"variables":[
									
								]
							},
							"actions":[
								
							],
							"returns":"text",
							"filterId":"SqaHMz87ZJ"
						}
					],
					"filterId":"lu2lEoBN2c",
					"property":"channel"
				}
			],
			"example":"",
			"baseType":"logic-chain",
			"filterId":"p7mdy1XuXP",
			"property":"channel"
		},
		"eventName":"log",
		"eventType":"broadcast",
		"datasource":"",
		"datasourceName":""
	},
	"actionInput": [
		{
			"type": "text",
			"props": [
				{
					"id": "action-0",
					"raw": "adm.request.requestBody?.projectId",
					"desc": "New Item Default Desc",
					"name": "New Item Default",
					"type": "text",
					"setSrc": "cmMdl->adm.request.requestBody?.projectId",
					"actions": [],
					"example": "",
					"baseType": "context-mapping",
					"filterId": "3LGqaIs6Nx",
					"property": "input"
				}
			],
			"message": "asdfasdf",
			"metadata": {
				"regex": "",
				"valut": ""
			},
			"property": "projectId",
			"required": true,
			"valutKey": "",
			"additionalHeaders": []
		},
		{
			"type": "text",
			"props": [
				{
					"raw": "adm.request.requestBody?.data",
					"desc": "This is mapped value & logic for property input",
					"name": "Propery \"input\" mapping",
					"type": "text",
					"setSrc": "cmMdl->adm.request.requestBody?.data",
					"actions": [],
					"example": "",
					"baseType": "context-mapping",
					"filterId": "85RgrPKu0u",
					"property": "input"
				}
			],
			"message": "Log \"data\" was not set",
			"metadata": {
				"regex": "",
				"valut": ""
			},
			"property": "data",
			"required": true,
			"valutKey": "",
			"additionalHeaders": []
		}
	],
	"logic": [
		{
			"output":[
				
			],
			"isNew":false,
			"id":"61",
			"type":"text",
			"name":"Action #1",
			"description":"Action #1 Description",
			"schema":{
				"_action":{
					"category":"logic",
					"action":"do"
				},
				"run":{
					"example":"",
					"id":"ahLTdzTOxY",
					"filterId":"Hw9xjKQJsT",
					"property":"run",
					"name":"Propery \"run\" mapping",
					"desc":"This is mapped value & logic for property run",
					"baseType":"logic-chain",
					"type":"text",
					"raw":"",
					"actions":[
						{
							"id":"XRcBmCmnT7",
							"filterId":"RssUohtMYM",
							"property":"filename",
							"name":"Action 1",
							"type":"string",
							"actions":[
								{
									"id":"XyFPkyCZmt",
									"filterId":"woesgVKkze",
									"type":"custom",
									"name":"Logic item \"0\"",
									"logic":{
										"raw":"adm.setResult(adm.input?.data);\nreturn 'success';",
										"formula":"",
										"source":"",
										"prop":"",
										"type":"",
										"subtype":"",
										"variables":[
											
										],
										"opArgs":[
											
										]
									},
									"returns":"text",
									"actions":[
										
									]
								}
							]
						}
					]
				}
			},
			"successCode":200,
			"successMessage":"Success message",
			"errorCode":400,
			"errorMessage":"Error message"
		}
	],
	"output":[],
	"selected":true
}