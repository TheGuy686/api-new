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
          "action": "error"
        },
        "error": {
          "example": "",
          "id": "5d9sIPsSZg",
          "property": "error",
          "name": "Propery \"error\" mapping",
          "desc": "This is mapped value & logic for property error",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.host",
          "actions": []
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