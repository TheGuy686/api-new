export default {
  "actionInput": [],
  "logic": [
    {
      "output": [],
      "isNew": false,
      "id": "47",
      "type": "text",
      "name": "Action #1",
      "description": "Action #1 Description",
      "schema": {
        "_action": {
          "category": "database",
          "action": "get-list"
        },
        "datasource": 1,
        "entity": 12,
        "repo": "",
        "checkOn": [
          "ryan"
        ],
        "input": [
          {
            "id": "Ttw19K4xCP",
            "raw": "adm.request.host",
            "desc": "This is mapped value & logic for property firstName",
            "name": "Propery \"firstName\" mapping",
            "type": "text",
            "actions": [],
            "example": "",
            "baseType": "context-mapping",
            "property": "ryan"
          }
        ],
        "maximumDepth": 4
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