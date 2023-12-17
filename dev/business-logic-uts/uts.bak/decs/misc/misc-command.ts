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
          "raw": "Your email was successfully sent",
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
          "category": "misc",
          "action": "command"
        },
        "datasource": 1,
        "repo": "DefaultMysqlDB.Default",
        "rootFolder": {
          "example": "",
          "id": "aRnchbYwvc",
          "property": "rootFolder",
          "name": "Propery \"rootFolder\" mapping",
          "desc": "This is mapped value & logic for property rootFolder",
          "baseType": "primitive",
          "type": "text",
          "raw": "this-is-a-path/kryan",
          "actions": []
        },
        "input": {
          "example": "",
          "id": "6Qi1qxUBir",
          "property": "input",
          "name": "Propery \"input\" mapping",
          "desc": "This is mapped value & logic for property input",
          "baseType": "primitive",
          "type": "text",
          "raw": "sh this.script.sh",
          "actions": []
        },
        "runAsynchronous": true
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