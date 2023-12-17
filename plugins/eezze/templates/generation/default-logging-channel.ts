export default {
	"actionInput": [
		{
			"type": "text",
			"props": [
				{
					"id": "action-0",
					"raw": "adm.request.requestBody.projectId",
					"desc": "New Item Default Desc",
					"name": "New Item Default",
					"type": "text",
					"setSrc": "cmMdl->adm.request.requestBody.projectId",
					"actions": [],
					"example": "",
					"baseType": "context-mapping",
					"filterId": "3LGqaIs6Nx",
					"property": "input"
				}
			],
			"message": "ProjectLoggingChannel \"projectId\" was not set",
			"metadata": {
				"regex": "",
				"valut": ""
			},
			"property": "projectId",
			"required": true,
			"valutKey": "",
			"additionalHeaders": []
		}
	],
	"logic": [
	  {
		"output": [],
		"isNew": true,
		"id": "64",
		"type": "text",
		"name": "Action #1",
		"description": "Action #1 Description",
		"schema": {
		  "_action": {
			"category": "logic",
			"action": "do"
		  },
		  "run": {
			"example": "",
			"id": "UaINan0cB5",
			"filterId": "M4CUphSON9",
			"property": "run",
			"name": "Propery \"run\" mapping",
			"desc": "This is mapped value & logic for property run",
			"baseType": "logic-chain",
			"type": "text",
			"raw": "",
			"actions": [
			  {
				"id": "JHqsfng7tT",
				"filterId": "TipcyyTHS1",
				"property": "filename",
				"name": "Action 1",
				"type": "string",
				"actions": [
				  {
					"id": "sCyHA2Ihzv",
					"filterId": "3F5SGs5oXu",
					"type": "custom",
					"name": "Logic item \"0\"",
					"logic": {
					  "raw": "adm.setResult('Success');\nreturn 'success';",
					  "formula": "",
					  "source": "",
					  "prop": "",
					  "type": "",
					  "subtype": "",
					  "variables": [],
					  "opArgs": []
					},
					"returns": "text",
					"actions": []
				  }
				]
			  }
			]
		  }
		},
		"successCode": 200,
		"successMessage": "Success message",
		"errorCode": 400,
		"errorMessage": "Error message"
	  }
	],
	"output": [],
	"selected": true,
	"id": 13,
	"projectId": 175,
	"serviceGroupId": 26,
	"type": "websocket",
	"name": "Project Logging Channel",
	"description": "This is used for the subscription to the logging services which allows the eezze UI have access to all the operations and output to display on the eezze platform UI",
	"definition": {
	  "id": "project-logging-channel",
	  "user": {
		"id": "Uy7svHZQen",
		"raw": "",
		"desc": "This is mapped value & logic for property user",
		"name": "Propery 'user' mapping",
		"type": "text",
		"actions": [
		  {
			"id": "DErr7JCaNE",
			"name": "Action 1",
			"type": "string",
			"actions": [
			  {
				"id": "lv7KlxUrTM",
				"name": "Logic item '0'",
				"type": "custom",
				"logic": {
				  "raw": "return {\n\t\t\t...adm.request.auth.user,\n};",
				  "prop": "",
				  "type": "",
				  "opArgs": [],
				  "source": "",
				  "formula": "",
				  "subtype": "",
				  "variables": []
				},
				"actions": [],
				"returns": "object",
				"filterId": "xWhUW7zsch"
			  }
			],
			"filterId": "LQmJKdJba7",
			"property": "user"
		  }
		],
		"example": "",
		"baseType": "logic-chain",
		"filterId": "L2D1u0p6rw",
		"property": "user"
	  },
	  "channel": {
		"id": "hdPDU9uJrV",
		"raw": "",
		"desc": "This is mapped value & logic for property channel",
		"name": "Propery 'channel' mapping",
		"type": "text",
		"actions": [
		  {
			"id": "vpvZ5ZwMpd",
			"name": "Action 1",
			"type": "string",
			"actions": [
			  {
				"id": "ectfI4ivAF",
				"name": "Logic item '0'",
				"type": "custom",
				"logic": {
				  "raw": "return `pr-${adm.input.projectId}`;",
				  "prop": "",
				  "type": "",
				  "opArgs": [],
				  "source": "",
				  "formula": "",
				  "subtype": "",
				  "variables": []
				},
				"actions": [],
				"returns": "text",
				"filterId": "wEjMuIsaz8"
			  }
			],
			"filterId": "OpniTVRrIY",
			"property": "channel"
		  }
		],
		"example": "",
		"baseType": "logic-chain",
		"filterId": "iQQC4d3mOq",
		"property": "channel"
	  },
	  "emitState": false,
	  "eventName": "",
	  "eventType": "channel",
	  "datasource": "",
	  "datasourceName": ""
	}
}