export default {
    "actionInput": [],
    "logic": [
      {
        "id": "47",
        "name": "Action #1",
        "type": "text",
        "isNew": true,
        "output": [],
        "schema": {
          "repo": "",
          "input": [
            {
              "id": "Ttw19K4xCP",
              "raw": "adm.request.requestIp",
              "desc": "This is mapped value & logic for property firstName",
              "name": "Propery \"firstName\" mapping",
              "type": "text",
              "actions": [],
              "example": "",
              "baseType": "context-mapping",
              "property": "firstName"
            }
          ],
          "entity": 12,
          "_action": {
            "action": "create-one",
            "category": "database"
          },
          "datasource": 1
        },
        "errorCode": 400,
        "description": "Action #1 Description",
        "successCode": 200,
        "errorMessage": "Error message",
        "successMessage": "Success message"
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