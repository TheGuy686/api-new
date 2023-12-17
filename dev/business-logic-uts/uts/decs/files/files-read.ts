export default {
  "actionInput": [],
  "logic": [
    {
      "output": [
        {
          "example": "",
          "id": "WsjBTr7W7m",
          "property": "ryan",
          "name": "",
          "desc": "",
          "baseType": "primitive",
          "type": "text",
          "raw": "File was deleted",
          "actions": []
        },
        {
          "example": "",
          "id": "rSFwPd9DLj",
          "property": "lastName",
          "name": "",
          "desc": "",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.fullUrl",
          "actions": []
        }
      ],
      "isNew": false,
      "id": "47",
      "type": "text",
      "name": "Action #1",
      "description": "Action #1 Description",
      "schema": {
        "_action": {
          "category": "files",
          "action": "read"
        },
        "datasource": 1,
        "repo": "DefaultMysqlDB.Default",
        "fileType": "jpeg",
        "fileName": {
          "example": "",
          "id": "5XixOTpmnP",
          "property": "fileName",
          "name": "Propery \"fileName\" mapping",
          "desc": "This is mapped value & logic for property fileName",
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
                    "raw": "this-is-a-path/${1}/and-file-name/",
                    "formula": "",
                    "format": {},
                    "source": "",
                    "prop": "",
                    "variables": [
                      {
                        "pos": 1,
                        "id": 1,
                        "color": "#1d4a4a",
                        "format": {},
                        "value": "adm.request.method",
                        "example": "MtrPB"
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
  "id": 14,
  "projectId": 1,
  "serviceGroupId": 10,
  "type": "rest",
  "name": "Example",
  "description": "This is just an example service",
  "definition": {
    "path": "test",
    "datasource": 12,
    "datasourceName": "a-rest-server-another-thing",
    "roles": [
      2
    ],
    "method": "get"
  }
}