export default {
  "actionInput": [],
  "logic": [
    {
      "output": [],
      "isNew": false,
      "id": "11",
      "type": "text",
      "name": "Action #1",
      "description": "Action #1 Description",
      "schema": {
        "_action": {
          "category": "misc",
          "action": "success"
        },
        "success": {
          "example": "",
          "id": "5d9sIPsSZg",
          "property": "success",
          "name": "Propery \"success\" mapping",
          "desc": "This is mapped value & logic for property success",
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
                      "type": "formatter",
                      "logic": {
                        "subtype": "string-interpolate",
                        "prop": "prop1",
                        "format": "",
                        "formula": "",
                        "source": "",
                        "example": "",
                        "raw": "${1}",
                        "opArgs": [],
                        "variables": [
                          {
                            "pos": 1,
                            "id": 1,
                            "color": "#566725",
                            "format": {},
                            "value": "adm.request.fullUrl",
                            "example": "Y1ChB"
                          }
                        ]
                      },
                      "returns": "text",
                      "actions": []
                    }
                  ]
                },
                {
                  "id": "action-0-logic-1",
                  "type": "number-operation",
                  "name": "Logic item \"1\"",
                  "logic": {
                    "subtype": "calculation",
                    "formula": "${1}96*9",
                    "raw": "${1}96*9",
                    "resultPreview": 6264,
                    "variables": {
                      "v1": {
                        "pos": 1,
                        "color": "#983b58",
                        "alias": "${1}",
                        "value": "adm.request.method",
                        "example": 6
                      }
                    },
                    "spanPreview": "<span style=\"color: #983b58;\">${1}</span><span>9</span><span>6</span><span>x</span><span>9</span>",
                    "prop": ""
                  },
                  "returns": "string",
                  "actions": []
                },
                {
                  "id": "action-0-logic-2",
                  "type": "custom",
                  "name": "Logic item \"2\"",
                  "logic": {
                    "raw": "\n\n\n\n\n\n\n\nreturn 'yeah';\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
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
          ]
        }
      },
      "successCode": 201,
      "successMessage": "Success message MAIN ERROR",
      "errorCode": 400,
      "errorMessage": "Error message"
    }
  ],
  "output": [],
  "selected": true,
  "id": 15,
  "projectId": 1,
  "serviceGroupId": 11,
  "type": "rest",
  "name": "Test REST",
  "description": "This is just a simple test ",
  "definition": {
    "path": "hello-there",
    "roles": [
      2
    ],
    "method": "get"
  }
}