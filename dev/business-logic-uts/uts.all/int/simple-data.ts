export default {
    condition: `(adm: ADM) => { return 'ryan was here' == true}`,
    roles: ['ROLE_RYAN', 'ROLE_WATCH'],
    repo: 'RyansEntity',
    "actionInput": [],
    "logic": [
        {
            "output": [],
            "isNew": false,
            "id": "84",
            "type": "text",
            "name": "Action #1",
            "description": "Action #1 Description",
            "schema": {
                "_action": {
                    "category": "database",
                    "action": "get-one-and-update"
                },
                "datasource": 1,
                "entity": 12,
                "repo": "",
                "checkOn": [
                    "email"
                ],
                "input": [
                    {
                        "id": "EPu3FpXCWi",
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
                                        "id": "action-0-logic-0",
                                        "name": "Logic item \"0\"",
                                        "type": "custom",
                                        "logic": {
                                            "raw": "\nreturn Number('0.23531');\n",
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
                                "property": "filename",
                                "name": "Action 2",
                                "type": "string",
                                "actions": [
                                    {
                                        "id": "action-1-logic-0",
                                        "type": "custom",
                                        "name": "Logic item \"0\"",
                                        "logic": {
                                            "raw": "\n\n\n\n\n\n\n\nconsole.log('hello again ryan');\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
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
                ],
                "maximumDepth": 4
            },
            "successCode": 200,
            "successMessage": "Success message",
            "errorCode": 400,
            "errorMessage": "Error message"
        },
        {
            "id": "47",
            "name": "Action #2",
            "type": "text",
            "isNew": true,
            "output": [],
            "schema": {
                "repo": "DefaultMysqlDB.Default",
                "linter": "babel",
                "_action": {
                    "action": "save",
                    "category": "files"
                },
                "fileName": {
                    "id": "rlDkFjLQJL",
                    "raw": "adm.request.fullUrl",
                    "desc": "This is mapped value & logic for property fileName",
                    "name": "Propery \"fileName\" mapping",
                    "type": "text",
                    "actions": [],
                    "example": "",
                    "baseType": "context-mapping",
                    "property": "fileName"
                },
                "template": 2,
                "datasource": 1,
                "templateVars": [
                    {
                        "id": "VsskYKhEa9",
                        "raw": "adm.request.fullUrl",
                        "desc": "This is mapped value & logic for property ryan",
                        "name": "Propery \"ryan\" mapping",
                        "type": "text",
                        "actions": [],
                        "example": "",
                        "baseType": "context-mapping",
                        "property": "ryan"
                    }
                ]
            },
            "errorCode": 400,
            "description": "Action #2 Description",
            "successCode": 200,
            "errorMessage": "Error message",
            "successMessage": "Success message"
        },
        {
            "id": "36",
            "name": "Action #3",
            "type": "text",
            "isNew": true,
            "output": [],
            "schema": {
                "to": {
                    "id": "I7GlDq3MdC",
                    "raw": "ry@emaill.co",
                    "desc": "This is mapped value & logic for property to",
                    "name": "Propery \"to\" mapping",
                    "type": "text",
                    "actions": [],
                    "example": "",
                    "baseType": "primitive",
                    "property": "to"
                },
                "from": {
                    "id": "ARSt1RbW4P",
                    "raw": "Ryan Cooke",
                    "desc": "This is mapped value & logic for property from",
                    "name": "Propery \"from\" mapping",
                    "type": "text",
                    "actions": [],
                    "example": "",
                    "baseType": "primitive",
                    "property": "from"
                },
                "repo": "RolfsDemoDB.Default",
                "_action": {
                    "action": "send-smtp-email",
                    "category": "email"
                },
                "subject": {
                    "id": "LU7LElZyix",
                    "raw": "adm.request.fullUrl",
                    "desc": "This is mapped value & logic for property subject",
                    "name": "Propery \"subject\" mapping",
                    "type": "text",
                    "actions": [],
                    "example": "",
                    "baseType": "context-mapping",
                    "property": "subject"
                },
                "template": 1,
                "datasource": 3,
                "templateVars": [
                    {
                        "id": "0DRl8llWwt",
                        "raw": "adm.request.method",
                        "desc": "This is mapped value & logic for property asdf",
                        "name": "Propery \"asdf\" mapping",
                        "type": "text",
                        "actions": [],
                        "example": "",
                        "baseType": "context-mapping",
                        "property": "asdf"
                    }
                ]
            },
            "errorCode": 400,
            "description": "Action #3 Description",
            "successCode": 200,
            "errorMessage": "Error message",
            "successMessage": "Success message"
        },
        {
            "id": "92",
            "name": "Action #4",
            "type": "text",
            "isNew": true,
            "output": [],
            "schema": {
                "repo": "",
                "input": [
                    {
                        "id": "nvHggDuzWK",
                        "raw": "adm.request.fullUrl",
                        "desc": "This is mapped value & logic for property email",
                        "name": "Propery \"email\" mapping",
                        "type": "text",
                        "actions": [],
                        "example": "",
                        "baseType": "context-mapping",
                        "property": "email"
                    }
                ],
                "entity": 1,
                "_action": {
                    "action": "delete-one",
                    "category": "database"
                },
                "checkOn": [
                    "email"
                ],
                "datasource": 3
            },
            "errorCode": 400,
            "description": "Action #4 Description",
            "successCode": 200,
            "errorMessage": "Error message",
            "successMessage": "Success message"
        }
    ],
    "output": [],
    "selected": true,
    "id": 11,
    "projectId": 1,
    "serviceGroupId": 8,
    "type": "rest",
    "name": "Test",
    "description": "Test",
    "definition": {
        "path": "test",
        "roles": [
            2,
            6
        ],
        "method": "get"
    }
}
// {
//     "output": [],
//     "isNew": false,
//     "id": "84",
//     "type": "text",
//     "name": "Action #1",
//     "description": "Action #1 Description",
//     "schema": {
//       "_action": {
//         "category": "database",
//         "action": "get-one-and-update"
//       },
//       "datasource": 1,
//       "entity": 12,
//       "repo": "",
//       "checkOn": [
//         "email"
//       ],
//       "input": [
//         {
//           "id": "EPu3FpXCWi",
//           "raw": "",
//           "desc": "This is mapped value & logic for property email",
//           "name": "Propery \"email\" mapping",
//           "type": "text",
//           "actions": [
// {
//   "id": "action-0",
//   "name": "Action 1",
//   "type": "string",
//   "actions": [
//     {
//       "id": "action-0-logic-0",
//       "name": "Logic item \"0\"",
//       "type": "custom",
//       "logic": {
//         "raw": "\nreturn Number('0.23531');\n",
//         "prop": "",
//         "type": "",
//         "opArgs": [],
//         "source": "",
//         "formula": "",
//         "subtype": "",
//         "variables": []
//       },
//       "actions": [],
//       "returns": "string"
//     }
//   ],
//   "property": "filename"
// },
// {
//   "id": "action-1",
//   "property": "filename",
//   "name": "Action 2",
//   "type": "string",
//   "actions": [
//     {
//       "id": "action-1-logic-0",
//       "type": "custom",
//       "name": "Logic item \"0\"",
//       "logic": {
//         "raw": "\n\n\n\n\n\n\n\nconsole.log('hello again ryan');\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
//         "formula": "",
//         "source": "",
//         "prop": "",
//         "type": "",
//         "subtype": "",
//         "variables": [],
//         "opArgs": []
//       },
//       "returns": "string",
//       "actions": []
//     }
//   ]
// }
//           ],
//           "example": "",
//           "baseType": "logic-chain",
//           "property": "email"
//         }
//       ],
//       "maximumDepth": 4
//     },
//     "successCode": 200,
//     "successMessage": "Success message",
//     "errorCode": 400,
//     "errorMessage": "Error message"
//   }