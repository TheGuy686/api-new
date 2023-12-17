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
            "raw": "adm.request.requestHeaders.zzasdf",
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
            "id": "92",
            "name": "DB > Create One Action",
            "type": "text",
            "isNew": false,
            "output": [],
            "schema": {
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
                                                "name": "Logic item \"3\"",
                                                "type": "number-operation",
                                                "logic": {
                                                    "raw": "${1}85*9/8${2}",
                                                    "prop": "",
                                                    "formula": "${1}85*9/8${2}",
                                                    "subtype": "calculation",
                                                    "variables": {
                                                        "v1": {
                                                            "pos": 1,
                                                            "alias": "${1}",
                                                            "color": "#61793e",
                                                            "value": "adm.request.method",
                                                            "format": {},
                                                            "example": 10
                                                        },
                                                        "v2": {
                                                            "pos": 2,
                                                            "alias": "${2}",
                                                            "color": "#a45b31",
                                                            "value": "adm.request.fullUrl",
                                                            "format": {},
                                                            "example": 8
                                                        }
                                                    },
                                                    "spanPreview": "<span style=\"color: #61793e;\">${1}</span><span>8</span><span>5</span><span>x</span><span>9</span>÷<span>8</span><span style=\"color: #a45b31;\">${2}</span>",
                                                    "resultPreview": 110.9659090909091
                                                },
                                                "actions": [],
                                                "returns": "string"
                                            },
                                            {
                                                "id": "action-0-logic-4-logic-4",
                                                "name": "Logic item \"4\"",
                                                "type": "number-operation",
                                                "logic": {
                                                    "raw": "",
                                                    "prop": "",
                                                    "type": "",
                                                    "opArgs": [
                                                        {
                                                            "value": "adm.request.urlPath",
                                                            "example": 70
                                                        },
                                                        {
                                                            "value": "adm.request.requestIp",
                                                            "example": 49
                                                        }
                                                    ],
                                                    "source": "",
                                                    "formula": "",
                                                    "subtype": "addition",
                                                    "variables": []
                                                },
                                                "actions": [],
                                                "returns": "string"
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
                                        "name": "Logic item \"4\"",
                                        "type": "new",
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
                ],
                "entity": "ryans-entity",
                "_action": {
                    "action": "create-one",
                    "category": "database"
                },
                "datasource": "MysqlDefault"
            },
            "errorCode": 400,
            "description": "This is a create one db action test",
            "successCode": 200,
            "errorMessage": "Error message",
            "successMessage": "Success message"
        },
        {
            "output": [],
            "isNew": false,
            "id": "77",
            "type": "text",
            "name": "File Save > Example",
            "description": "This is an example of how to do a file save",
            "schema": {
                "_action": {
                    "category": "files",
                    "action": "save"
                },
                "datasource": "DefaultMysqlDB",
                "repo": "DefaultMysqlDB.Default",
                "fileType": "plain-text",
                "fileName": {
                    "id": "uxqgI9dng8",
                    "raw": "",
                    "desc": "This is mapped value & logic for property fileName",
                    "name": "Propery \"fileName\" mapping",
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
                                    "type": "number-operation",
                                    "logic": {
                                        "raw": "75-6",
                                        "prop": "",
                                        "formula": "75-6",
                                        "subtype": "calculation",
                                        "variables": {},
                                        "spanPreview": "<span>7</span><span>5</span>-<span>6</span>",
                                        "resultPreview": 69
                                    },
                                    "actions": [],
                                    "returns": "string"
                                },
                                {
                                    "id": "action-0-logic-1",
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
                                                "raw": "dfasdfasdf",
                                                "prop": "p1",
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
                                                "raw": "ewrwert",
                                                "prop": "p2",
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
                                    "id": "action-0-logic-2",
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
                                            "id": "action-0-logic-2-logic-0",
                                            "name": "Logic item \"0\"",
                                            "type": "custom",
                                            "logic": {
                                                "raw": "\n\n\n\n\n\n\n\n\n\nhello there\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
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
                                    "id": "action-0-logic-3",
                                    "name": "Logic item \"3\"",
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
                                                "prop": "somethingElse",
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
                                                "raw": "dfdfdf",
                                                "prop": "cookeie",
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
                                    "id": "action-0-logic-4",
                                    "name": "Logic item \"4\"",
                                    "type": "custom",
                                    "logic": {
                                        "raw": "\n\n\n\n\n\n\n\n\nreturn 'Heer was something else';\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
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
                                                "raw": "dfdfsdfsdf",
                                                "prop": "aTeat",
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
                                            "type": "custom",
                                            "logic": {
                                                "raw": "\n\n\n\n\n\n\n\n\n\n\n\nreturn 'ryan how are you';\n\n\n\n\n\n\n\n\n\n\n\n",
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
                            "property": "filename"
                        }
                    ],
                    "example": "",
                    "baseType": "logic-chain",
                    "property": "fileName"
                },
                "template": "",
                "linter": "",
                "templateVars": []
            },
            "successCode": 200,
            "successMessage": "Success message",
            "errorCode": 400,
            "errorMessage": "Error message"
        },
        {
            "output": [
                {
                    "id": "uZLbvUYm8n",
                    "raw": "adm.request.host",
                    "desc": "",
                    "name": "",
                    "type": "text",
                    "example": "",
                    "baseType": "context-mapping",
                    "property": "prop1",
                    "actions": []
                },
                {
                    "id": "HPmNLXIBvV",
                    "raw": "this is a static value",
                    "desc": "",
                    "name": "",
                    "type": "text",
                    "example": "",
                    "baseType": "primitive",
                    "property": "prop2",
                    "actions": []
                },
            ],
            "isNew": false,
            "id": "42",
            "type": "text",
            "name": "DB > Delete One Example",
            "description": "This is an example of how to handle the onError",
            "schema": {
              "_action": {
                "category": "database",
                "action": "delete-one"
              },
              "datasource": "DefaultMysqlDB",
              "entity": 20,
              "repo": "",
              "checkOn": [
                "email"
              ],
              "input": [
                {
                  "id": "SdvGF3wcGl",
                  "raw": "",
                  "desc": "This is mapped value & logic for property email",
                  "name": "Propery \"email\" mapping",
                  "type": "text",
                  "actions": [
                    {
                      "id": "action-0",
                      "property": "filename",
                      "name": "Action 1",
                      "type": "string",
                      "actions": [
                        {
                          "id": "action-0-logic-0",
                          "type": "assign-values",
                          "name": "Logic item \"0\"",
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
                          "actions": [
                            {
                              "id": "act-0",
                              "type": "assign-primitive",
                              "logic": {
                                "subtype": "text",
                                "prop": "bigTest1",
                                "format": "",
                                "formula": "",
                                "source": "",
                                "example": "",
                                "raw": "fgfgfgf",
                                "opArgs": [],
                                "variables": []
                              },
                              "returns": "text",
                              "actions": []
                            },
                            {
                              "id": "act-1",
                              "type": "assign-primitive",
                              "logic": {
                                "subtype": "text",
                                "prop": "bigTest2",
                                "format": "",
                                "formula": "",
                                "source": "",
                                "example": "",
                                "raw": "fgfgfg",
                                "opArgs": [],
                                "variables": []
                              },
                              "returns": "text",
                              "actions": []
                            }
                          ]
                        },
                        {
                          "id": "action-0-logic-1",
                          "type": "custom",
                          "name": "Logic item \"1\"",
                          "logic": {
                            "raw": "\n\n\n\n\n\nasdfasdfasdf\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
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
                      ]
                    }
                  ],
                  "example": "",
                  "baseType": "logic-chain",
                  "property": "email"
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
        "method": "get",
        "condition": {
            "id": "1YOqowltxy",
            "raw": "",
            "desc": "This is mapped value & logic for property condition",
            "name": "Propery \"condition\" mapping RYAN",
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
                    "type": "custom",
                    "logic": {
                      "raw": "adfasdfa",
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
                    "id": "action-0-logic-1",
                    "type": "set-state-values",
                    "name": "Logic item \"1\"",
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
                    "actions": [
                      {
                        "id": "act-0",
                        "type": "assign-primitive",
                        "logic": {
                          "subtype": "text",
                          "prop": "stateTwest1",
                          "format": "",
                          "formula": "",
                          "source": "",
                          "example": "",
                          "raw": "vzcvzxcvzxcv",
                          "opArgs": [],
                          "variables": []
                        },
                        "returns": "text",
                        "actions": []
                      },
                      {
                        "id": "act-1",
                        "type": "assign-primitive",
                        "logic": {
                          "subtype": "number",
                          "prop": "stateTwest2",
                          "format": "",
                          "formula": "3234",
                          "source": "",
                          "example": "",
                          "raw": "3234",
                          "opArgs": [],
                          "variables": []
                        },
                        "returns": "number",
                        "actions": []
                      }
                    ]
                  },
                  {
                    "id": "action-0-logic-1",
                    "type": "set-stash-values",
                    "name": "Logic item \"1\"",
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
                    "actions": [
                      {
                        "id": "act-0",
                        "type": "assign-primitive",
                        "logic": {
                          "subtype": "text",
                          "prop": "stateTwest1",
                          "format": "",
                          "formula": "",
                          "source": "",
                          "example": "",
                          "raw": "vzcvzxcvzxcv",
                          "opArgs": [],
                          "variables": []
                        },
                        "returns": "text",
                        "actions": []
                      },
                      {
                        "id": "act-1",
                        "type": "assign-primitive",
                        "logic": {
                          "subtype": "number",
                          "prop": "stateTwest2",
                          "format": "",
                          "formula": "3234",
                          "source": "",
                          "example": "",
                          "raw": "3234",
                          "opArgs": [],
                          "variables": []
                        },
                        "returns": "number",
                        "actions": []
                      }
                    ]
                  }
                ],
                "property": "condition"
              }
            ],
            "example": "",
            "baseType": "logic-chain",
            "property": "condition"
          }
    }
}