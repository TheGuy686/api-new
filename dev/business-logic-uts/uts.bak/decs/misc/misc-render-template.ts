export default {
  "actionInput": [],
  "logic": [
    {
      "output": [
        {
          "id": "WsjBTr7W7m",
          "raw": "adm.request.method",
          "desc": "",
          "name": "",
          "type": "text",
          "actions": [],
          "example": "",
          "baseType": "context-mapping",
          "property": "message"
        },
        {
          "id": "rSFwPd9DLj",
          "raw": "a body",
          "desc": "",
          "name": "",
          "type": "text",
          "actions": [],
          "example": "",
          "baseType": "primitive",
          "property": "body"
        }
      ],
      "isNew": false,
      "id": "47",
      "type": "object",
      "name": "Action #1",
      "description": "Action #1 Description",
      "schema": {
        "_action": {
          "category": "files",
          "action": "render-template"
        },
        "datasource": "",
        "repo": ".Default",
        "toPath": {
          "example": "",
          "id": "A1Hvd4AD84",
          "property": "toPath",
          "name": "Propery \"toPath\" mapping",
          "desc": "This is mapped value & logic for property toPath",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.fullUrl",
          "actions": []
        },
        "fileName": {
          "example": "",
          "id": "6aZzFKj8TW",
          "property": "fileName",
          "name": "Propery \"fileName\" mapping",
          "desc": "This is mapped value & logic for property fileName",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.urlPath",
          "actions": []
        },
        "linter": "babel",
        "actionListSource": {
          "example": "",
          "id": "65W86axYTW",
          "property": "actionListSource",
          "name": "Propery \"actionListSource\" mapping",
          "desc": "This is mapped value & logic for property actionListSource",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.fullUrl",
          "actions": []
        },
        "template": 2,
        "templateVars": [
          {
            "example": "",
            "id": "ovHJZ1QIw0",
            "property": "email",
            "name": "Propery \"email\" mapping",
            "desc": "This is mapped value & logic for property email",
            "baseType": "logic-chain",
            "type": "text",
            "raw": "",
            "actions": [
              {
                "id": "action-0",
                "property": "filename",
                "name": "Action 1",
                "type": "string",
                "actions": [
                  {
                    "id": "action-0-logic-0",
                    "type": "formatter",
                    "name": "Logic item \"0\"",
                    "logic": {
                      "subtype": "string-interpolate",
                      "raw": "${1} how are you today?",
                      "formula": "",
                      "format": {},
                      "source": "",
                      "prop": "",
                      "variables": [
                        {
                          "pos": 1,
                          "id": 1,
                          "color": "#3e9a1e",
                          "format": {},
                          "value": "adm.request.fullUrl",
                          "example": "ryan"
                        }
                      ],
                      "opArgs": []
                    },
                    "returns": "text",
                    "actions": []
                  }
                ]
              }
            ]
          },
          {
            "example": "",
            "id": "ofk6A3JAII",
            "property": "helloThere",
            "name": "Propery \"helloThere\" mapping",
            "desc": "This is mapped value & logic for property helloThere",
            "baseType": "logic-chain",
            "type": "object",
            "raw": "",
            "actions": [
              {
                "id": "action-0",
                "property": "filename",
                "name": "Action 1",
                "type": "string",
                "actions": [
                  {
                    "id": "action-0-logic-0",
                    "type": "formatter",
                    "name": "Logic item \"0\"",
                    "logic": {
                      "subtype": "object",
                      "raw": [
                        {
                          "key": "prop1",
                          "value": "adm.request.method",
                          "returns": "text",
                          "data": []
                        },
                        {
                          "key": "prop2",
                          "value": "adm.request.host",
                          "returns": "text",
                          "data": []
                        },
                        {
                          "key": "obj",
                          "value": "",
                          "returns": "object",
                          "data": [
                            {
                              "key": "oprop1",
                              "value": "adm.request.method",
                              "returns": "text",
                              "data": []
                            },
                            {
                              "key": "oprop2",
                              "value": "adm.request.host",
                              "returns": "text",
                              "data": []
                            }
                          ]
                        }
                      ],
                      "formula": "",
                      "format": {},
                      "source": "",
                      "prop": "",
                      "variables": [],
                      "opArgs": []
                    },
                    "returns": "number",
                    "actions": []
                  }
                ]
              }
            ]
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
  "id": 14,
  "projectId": 1,
  "serviceGroupId": 10,
  "type": "rest",
  "name": "Example",
  "description": "This is just an example service",
  "definition": {
    "path": "test",
    "roles": [
      2
    ],
    "method": "get"
  }
}