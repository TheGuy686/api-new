export default {
	"actionInput": [
	  {
		"id": "uZLbvUYm8n",
		"raw": "adm.request.host",
		"desc": "",
		"name": "",
		"type": "text",
		"actions": [],
		"example": "",
		"baseType": "context-mapping",
		"property": "prop1"
	  },
	  {
		"id": "HPmNLXIBvV",
		"raw": "this is a static value",
		"desc": "",
		"name": "",
		"type": "text",
		"actions": [],
		"example": "",
		"baseType": "primitive",
		"property": "prop2"
	  },
	  {
		"id": "WafXwOCa5W",
		"raw": "adm.request.requestBody.ryan",
		"desc": "",
		"name": "",
		"type": "text",
		"actions": [],
		"example": "",
		"baseType": "context-mapping",
		"property": "prop3"
	  },
	  {
		"id": "YC4OJWf8yD",
		"raw": "adm.request.urlParams.hiThere",
		"desc": "",
		"name": "",
		"type": "text",
		"actions": [],
		"example": "",
		"baseType": "context-mapping",
		"property": "prop4"
	  },
	  {
		"id": "5mxu5QgkvI",
		"raw": {},
		"desc": "",
		"name": "",
		"type": "text",
		"actions": [],
		"example": "",
		"baseType": "logic-chain",
		"property": "prop5"
	  }
	],
	"logic": [
	  {
		"output": [],
		"isNew": false,
		"id": "92",
		"type": "text",
		"name": "Action #1",
		"description": "Action #1 Description",
		"schema": {
		  "_action": {
			"category": "database",
			"action": "create-one"
		  },
		  "datasource": "",
		  "entity": "",
		  "repo": ".",
		  "input": [
			{
			  "id": "47rUtWHEk3",
			  "raw": "",
			  "desc": "This is mapped value & logic for property email",
			  "name": "Propery \"email\" mapping",
			  "type": "text",
			  "actions": [
				{
				  "id": "action-0",
				  "name": "Action 1",
				  "type": "string",
				  "actions": [
					{
					  "id": "action-0-logic-2",
					  "name": "Logic item \"2\"",
					  "type": "assign-values",
					  "logic": {
						"raw": "",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [
						{
						  "id": "act-0",
						  "type": "assign-primitive",
						  "logic": {
							"raw": [
							  {
								"type": "condition",
								"opArgs": [
								  {
									"id": "is-true",
									"type": "text",
									"value": "adm.request.host",
									"example": "3"
								  }
								],
								"operator": "is-true"
							  }
							],
							"prop": "aTest1",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "boolean",
							"variables": []
						  },
						  "actions": [],
						  "returns": "boolean"
						},
						{
						  "id": "act-1",
						  "type": "assign-primitive",
						  "logic": {
							"raw": "hello  there",
							"prop": "aTest2",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "text",
							"variables": []
						  },
						  "actions": [],
						  "returns": "text"
						}
					  ],
					  "returns": "string"
					},
					{
					  "id": "action-0-logic-3",
					  "name": "Logic item \"3\"",
					  "type": "formatter",
					  "logic": {
						"raw": "21${1}",
						"prop": "",
						"format": "",
						"opArgs": [],
						"source": "",
						"formula": "2183",
						"subtype": "number",
						"variables": [
						  {
							"id": 1,
							"pos": 1,
							"color": "#3b34b3",
							"value": "adm.request.method",
							"format": {},
							"example": 83
						  }
						]
					  },
					  "actions": [],
					  "returns": "number"
					},
					{
					  "id": "action-0-logic-4",
					  "name": "Logic item \"4\"",
					  "type": "list-process",
					  "logic": {
						"raw": "adm.request.host",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [
						{
						  "id": "action-0-logic-4-logic-0",
						  "name": "Logic item \"0\"",
						  "type": "assign-values",
						  "logic": {
							"raw": "",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [
							{
							  "id": "act-0",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "asdfasdf",
								"prop": "iProp1",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							},
							{
							  "id": "act-1",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "asdasdf",
								"prop": "iProp2",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							},
							{
							  "id": "act-2",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "asdfasdf",
								"prop": "iProp3",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							}
						  ],
						  "returns": "string"
						},
						{
						  "id": "action-0-logic-4-logic-1",
						  "name": "Logic item \"1\"",
						  "type": "custom",
						  "logic": {
							"raw": "\n\n\n\n\n\n\n\nconsole.log(ilc.prop('iProp1'));\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [],
						  "returns": "string"
						},
						{
						  "id": "action-0-logic-4-logic-2",
						  "name": "Logic item \"2\"",
						  "type": "list-process",
						  "logic": {
							"raw": "adm.request.host",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [
							{
							  "id": "action-0-logic-4-logic-2-logic-0",
							  "name": "Logic item \"0\"",
							  "type": "assign-values",
							  "logic": {
								"raw": "",
								"prop": "",
								"type": "",
								"opArgs": [],
								"source": "",
								"formula": "",
								"subtype": "",
								"variables": []
							  },
							  "actions": [
								{
								  "id": "act-0",
								  "type": "assign-primitive",
								  "logic": {
									"raw": "dsfasdfasdf",
									"prop": "iiProp1",
									"format": "",
									"opArgs": [],
									"source": "",
									"example": "",
									"formula": "",
									"subtype": "text",
									"variables": []
								  },
								  "actions": [],
								  "returns": "text"
								},
								{
								  "id": "act-1",
								  "type": "assign-primitive",
								  "logic": {
									"raw": "sgsdfgs",
									"prop": "iiProp2",
									"format": "",
									"opArgs": [],
									"source": "",
									"example": "",
									"formula": "",
									"subtype": "text",
									"variables": []
								  },
								  "actions": [],
								  "returns": "text"
								},
								{
								  "id": "act-2",
								  "type": "assign-primitive",
								  "logic": {
									"raw": "adfafdasdf",
									"prop": "iiProp3",
									"format": "",
									"opArgs": [],
									"source": "",
									"example": "",
									"formula": "",
									"subtype": "text",
									"variables": []
								  },
								  "actions": [],
								  "returns": "text"
								}
							  ],
							  "returns": "string"
							},
							{
							  "id": "action-0-logic-4-logic-2-logic-1",
							  "name": "Logic item \"1\"",
							  "type": "custom",
							  "logic": {
								"raw": "\n\n\n\n\n\n\n\n\nconsole.log(iilc.prop('iiProp1'));\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
								"prop": "",
								"type": "",
								"opArgs": [],
								"source": "",
								"formula": "",
								"subtype": "",
								"variables": []
							  },
							  "actions": [],
							  "returns": "string"
							},
							{
							  "id": "action-0-logic-4-logic-2-logic-2",
							  "name": "Logic item \"2\"",
							  "type": "list-process",
							  "logic": {
								"raw": "adm.request.host",
								"prop": "",
								"type": "",
								"opArgs": [],
								"source": "",
								"formula": "",
								"subtype": "",
								"variables": []
							  },
							  "actions": [
								{
								  "id": "action-0-logic-4-logic-2-logic-2-logic-0",
								  "name": "Logic item \"0\"",
								  "type": "assign-values",
								  "logic": {
									"raw": "",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [
									{
									  "id": "act-0",
									  "type": "assign-primitive",
									  "logic": {
										"raw": "dfsdfgsdfg",
										"prop": "iiiProp1",
										"format": "",
										"opArgs": [],
										"source": "",
										"example": "",
										"formula": "",
										"subtype": "text",
										"variables": []
									  },
									  "actions": [],
									  "returns": "text"
									},
									{
									  "id": "act-1",
									  "type": "assign-primitive",
									  "logic": {
										"raw": "fsfdgsfdg",
										"prop": "iiiProp2",
										"format": "",
										"opArgs": [],
										"source": "",
										"example": "",
										"formula": "",
										"subtype": "text",
										"variables": []
									  },
									  "actions": [],
									  "returns": "text"
									}
								  ],
								  "returns": "string"
								},
								{
								  "id": "action-0-logic-4-logic-2-logic-2-logic-1",
								  "name": "Logic item \"1\"",
								  "type": "custom",
								  "logic": {
									"raw": "\n\n\n\n\nconsole.log(iilc.prop('iiProp1'));\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [],
								  "returns": "string"
								},
								{
								  "id": "action-0-logic-4-logic-2-logic-2-logic-2",
								  "name": "Logic item \"2\"",
								  "type": "formatter",
								  "logic": {
									"raw": "",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [],
								  "returns": "string"
								},
								{
								  "id": "action-0-logic-4-logic-2-logic-2-logic-3",
								  "name": "Logic item \"3\"",
								  "type": "list-process",
								  "logic": {
									"raw": "adm.request.host",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [
									{
									  "id": "action-0-logic-4-logic-2-logic-2-logic-3-logic-0",
									  "name": "Logic item \"0\"",
									  "type": "custom",
									  "logic": {
										"raw": "\n\n\n\n\n\n\n\nconsole.log(iiilc.prop('iiiiProp1'));\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
										"prop": "",
										"type": "",
										"opArgs": [],
										"source": "",
										"formula": "",
										"subtype": "",
										"variables": []
									  },
									  "actions": [],
									  "returns": "string"
									}
								  ],
								  "returns": "string"
								}
							  ],
							  "returns": "string"
							}
						  ],
						  "returns": "string"
						},
						{
						  "id": "action-0-logic-4-logic-3",
						  "type": "number-operation",
						  "name": "Logic item \"3\"",
						  "logic": {
							"subtype": "calculation",
							"formula": "${1}85*9/8${2}",
							"raw": "${1}85*9/8${2}",
							"resultPreview": 110.9659090909091,
							"variables": {
							  "v1": {
								"pos": 1,
								"color": "#61793e",
								"alias": "${1}",
								"value": "adm.request.method",
								"example": 10,
								"format": {}
							  },
							  "v2": {
								"pos": 2,
								"color": "#a45b31",
								"alias": "${2}",
								"value": "adm.request.fullUrl",
								"example": 8,
								"format": {}
							  }
							},
							"spanPreview": "<span style=\"color: #61793e;\">${1}</span><span>8</span><span>5</span><span>x</span><span>9</span>÷<span>8</span><span style=\"color: #a45b31;\">${2}</span>",
							"prop": ""
						  },
						  "returns": "string",
						  "actions": []
						},
						{
						  "id": "action-0-logic-4-logic-4",
						  "type": "number-operation",
						  "name": "Logic item \"4\"",
						  "logic": {
							"raw": "",
							"formula": "",
							"source": "",
							"prop": "",
							"type": "",
							"subtype": "addition",
							"variables": [],
							"opArgs": [
							  {
								"value": "adm.request.urlPath",
								"example": 70
							  },
							  {
								"value": "adm.request.requestIp",
								"example": 49
							  }
							]
						  },
						  "returns": "string",
						  "actions": []
						}
					  ],
					  "returns": "string"
					},
					{
					  "id": "action-0-logic-5",
					  "name": "Logic item \"5\"",
					  "type": "custom",
					  "logic": {
						"raw": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconsole.log('getting to there: ', adm.stash);\n\n\n\n\n\n\n\n",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [],
					  "returns": "string"
					},
					{
					  "id": "action-0-logic-4",
					  "type": "new",
					  "name": "Logic item \"4\"",
					  "logic": {
						"raw": "",
						"formula": "",
						"source": "",
						"prop": "",
						"type": "",
						"subtype": "",
						"variables": [],
						"opArgs": []
					  },
					  "returns": "string",
					  "actions": []
					}
				  ],
				  "property": "filename"
				},
				{
				  "id": "action-1",
				  "name": "Action 2",
				  "type": "string",
				  "actions": [
					{
					  "id": "action-1-logic-0",
					  "name": "Logic item \"0\"",
					  "type": "assign-values",
					  "logic": {
						"raw": "",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [
						{
						  "id": "act-0",
						  "type": "assign-primitive",
						  "logic": {
							"raw": "sfdgsdfg",
							"prop": "iI1Test",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "text",
							"variables": []
						  },
						  "actions": [],
						  "returns": "text"
						},
						{
						  "id": "act-1",
						  "type": "assign-primitive",
						  "logic": {
							"raw": "asfdasdf",
							"prop": "iI1Test2",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "text",
							"variables": []
						  },
						  "actions": [],
						  "returns": "text"
						},
						{
						  "id": "act-2",
						  "type": "assign-primitive",
						  "logic": {
							"raw": "asdfasdf",
							"prop": "iI1Test3",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "text",
							"variables": []
						  },
						  "actions": [],
						  "returns": "text"
						}
					  ],
					  "returns": "string"
					},
					{
					  "id": "action-1-logic-1",
					  "name": "Logic item \"1\"",
					  "type": "list-process",
					  "logic": {
						"raw": "adm.request.host",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [
						{
						  "id": "action-1-logic-1-logic-0",
						  "name": "Logic item \"0\"",
						  "type": "assign-values",
						  "logic": {
							"raw": "",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [
							{
							  "id": "act-0",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "asdfasdf",
								"prop": "iI1Test",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							},
							{
							  "id": "act-1",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "SADSAd",
								"prop": "iI1Test2",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							}
						  ],
						  "returns": "string"
						},
						{
						  "id": "action-1-logic-1-logic-1",
						  "name": "Logic item \"1\"",
						  "type": "custom",
						  "logic": {
							"raw": "\n\n\n\n\n\n\n\nconsole.log('To here again');\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [],
						  "returns": "string"
						}
					  ],
					  "returns": "string"
					},
					{
					  "id": "action-1-logic-2",
					  "name": "Logic item \"2\"",
					  "type": "custom",
					  "logic": {
						"raw": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconsole.log('Almost the last');\n\n\n\n\n\n\n\n\n",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [],
					  "returns": "string"
					}
				  ],
				  "property": "filename"
				}
			  ],
			  "example": "",
			  "baseType": "logic-chain",
			  "property": "email"
			},
			{
			  "id": "zqifemqSqw",
			  "raw": "",
			  "desc": "This is mapped value & logic for property firstName",
			  "name": "Propery \"firstName\" mapping",
			  "type": "text",
			  "actions": [
				{
				  "id": "action-0",
				  "name": "Action 1",
				  "type": "string",
				  "actions": [
					{
					  "id": "action-0-logic-0",
					  "name": "Logic item \"0\"",
					  "type": "assign-values",
					  "logic": {
						"raw": "",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [
						{
						  "id": "act-0",
						  "type": "assign-primitive",
						  "logic": {
							"raw": "asdfasdf",
							"prop": "ryan1",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "text",
							"variables": []
						  },
						  "actions": [],
						  "returns": "text"
						},
						{
						  "id": "act-1",
						  "type": "assign-primitive",
						  "logic": {
							"raw": "asdfasdf",
							"prop": "ryan2",
							"format": "",
							"opArgs": [],
							"source": "",
							"example": "",
							"formula": "",
							"subtype": "text",
							"variables": []
						  },
						  "actions": [],
						  "returns": "text"
						}
					  ],
					  "returns": "string"
					},
					{
					  "id": "action-0-logic-1",
					  "name": "Logic item \"1\"",
					  "type": "list-process",
					  "logic": {
						"raw": "adm.request.host",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [
						{
						  "id": "action-0-logic-1-logic-0",
						  "name": "Logic item \"0\"",
						  "type": "assign-values",
						  "logic": {
							"raw": "",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [
							{
							  "id": "act-0",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "fdgsfdgsdg",
								"prop": "joseph1",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							},
							{
							  "id": "act-1",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "sdfsfdg",
								"prop": "joseph2",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							},
							{
							  "id": "act-2",
							  "type": "assign-primitive",
							  "logic": {
								"raw": "sfgsdfg",
								"prop": "joseph3",
								"format": "",
								"opArgs": [],
								"source": "",
								"example": "",
								"formula": "",
								"subtype": "text",
								"variables": []
							  },
							  "actions": [],
							  "returns": "text"
							}
						  ],
						  "returns": "string"
						},
						{
						  "id": "action-0-logic-1-logic-1",
						  "name": "Logic item \"1\"",
						  "type": "custom",
						  "logic": {
							"raw": "\n${1} ryan",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": [
							  {
								"id": "arg-1",
								"pos": 1,
								"color": "#26b08f",
								"value": "adm.request.urlPath",
								"format": {},
								"example": ""
							  }
							]
						  },
						  "actions": [],
						  "returns": "string"
						},
						{
						  "id": "action-0-logic-1-logic-2",
						  "name": "Logic item \"2\"",
						  "type": "list-process",
						  "logic": {
							"raw": "adm.request.host",
							"prop": "",
							"type": "",
							"opArgs": [],
							"source": "",
							"formula": "",
							"subtype": "",
							"variables": []
						  },
						  "actions": [
							{
							  "id": "action-0-logic-1-logic-2-logic-0",
							  "name": "Logic item \"0\"",
							  "type": "assign-values",
							  "logic": {
								"raw": "",
								"prop": "",
								"type": "",
								"opArgs": [],
								"source": "",
								"formula": "",
								"subtype": "",
								"variables": []
							  },
							  "actions": [
								{
								  "id": "act-0",
								  "type": "assign-primitive",
								  "logic": {
									"raw": "adsasdfasdf",
									"prop": "cooke",
									"format": "",
									"opArgs": [],
									"source": "",
									"example": "",
									"formula": "",
									"subtype": "text",
									"variables": []
								  },
								  "actions": [],
								  "returns": "text"
								}
							  ],
							  "returns": "string"
							},
							{
							  "id": "action-0-logic-1-logic-2-logic-2",
							  "name": "Logic item \"2\"",
							  "type": "list-process",
							  "logic": {
								"raw": "adm.request.host",
								"prop": "",
								"type": "",
								"opArgs": [],
								"source": "",
								"formula": "",
								"subtype": "",
								"variables": []
							  },
							  "actions": [
								{
								  "id": "action-0-logic-1-logic-2-logic-2-logic-0",
								  "name": "Logic item \"0\"",
								  "type": "custom",
								  "logic": {
									"raw": "\n\n\n\n\n\n\n\n\nconsole.log('hello');\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [],
								  "returns": "string"
								},
								{
								  "id": "action-0-logic-1-logic-2-logic-2-logic-1",
								  "name": "Logic item \"1\"",
								  "type": "assign-values",
								  "logic": {
									"raw": "",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [
									{
									  "id": "act-0",
									  "type": "assign-primitive",
									  "logic": {
										"raw": "",
										"prop": "sadfassdf",
										"format": "",
										"opArgs": [],
										"source": "",
										"example": "",
										"formula": "",
										"subtype": "text",
										"variables": []
									  },
									  "actions": [],
									  "returns": "text"
									}
								  ],
								  "returns": "string"
								},
								{
								  "id": "action-0-logic-1-logic-2-logic-2-logic-2",
								  "name": "Logic item \"2\"",
								  "type": "list-process",
								  "logic": {
									"raw": "adm.request.host",
									"prop": "",
									"type": "",
									"opArgs": [],
									"source": "",
									"formula": "",
									"subtype": "",
									"variables": []
								  },
								  "actions": [
									{
									  "id": "action-0-logic-1-logic-2-logic-2-logic-2-logic-0",
									  "name": "Logic item \"0\"",
									  "type": "custom",
									  "logic": {
										"raw": "\n\n\n\n\n\n\n\nasdasdfasdf\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
										"prop": "",
										"type": "",
										"opArgs": [],
										"source": "",
										"formula": "",
										"subtype": "",
										"variables": []
									  },
									  "actions": [],
									  "returns": "string"
									}
								  ],
								  "returns": "string"
								}
							  ],
							  "returns": "string"
							}
						  ],
						  "returns": "string"
						}
					  ],
					  "returns": "string"
					},
					{
					  "id": "action-0-logic-2",
					  "name": "Logic item \"2\"",
					  "type": "custom",
					  "logic": {
						"raw": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nconsole.log('Hello how are you today?');\n\n\n\n\n\n\n\n\n",
						"prop": "",
						"type": "",
						"opArgs": [],
						"source": "",
						"formula": "",
						"subtype": "",
						"variables": []
					  },
					  "actions": [],
					  "returns": "string"
					}
				  ],
				  "property": "filename"
				}
			  ],
			  "example": "",
			  "baseType": "logic-chain",
			  "property": "firstName"
			}
		  ]
		},
		"successCode": 200,
		"successMessage": "Success message",
		"errorCode": 400,
		"errorMessage": "Error message"
	  }
	],
	"output": [],
	"selected": true,
	"id": 16,
	"projectId": 1,
	"serviceGroupId": 11,
	"type": "rest",
	"name": "Simple Test",
	"description": "This is just a service for doing simple tests",
	"definition": {
	  "path": "this-ia-a-path",
	  "roles": [
		13
	  ],
	  "method": "get"
	}
  }