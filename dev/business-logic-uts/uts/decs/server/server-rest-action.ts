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
          "category": "server",
          "action": "rest-action"
        },
        "datasource": 1,
        "repo": "DefaultMysqlDB.Default",
        "method": "get",
        "path": {
          "example": "",
          "id": "c1c2VS1lOP",
          "property": "path",
          "name": "Propery \"path\" mapping",
          "desc": "This is mapped value & logic for property path",
          "baseType": "primitive",
          "type": "text",
          "raw": "this-is-jsut-a-path",
          "actions": []
        },
        "headers": [
          {
            "example": "",
            "id": "UMBjMUK0vO",
            "property": "authentication",
            "name": "Propery \"authentication\" mapping",
            "desc": "This is mapped value & logic for property authentication",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.urlPath",
            "actions": []
          }
        ],
        "urlParams": [
          {
            "example": "",
            "id": "ufcgFcvJKS",
            "property": "thisIsJustAValue",
            "name": "Propery \"thisIsJustAValue\" mapping",
            "desc": "This is mapped value & logic for property thisIsJustAValue",
            "baseType": "context-mapping",
            "type": "number",
            "raw": "adm.request.fullUrl",
            "actions": []
          }
        ],
        "requestBody": [
          {
            "example": "",
            "id": "JAbc2SqKOE",
            "property": "email",
            "name": "Propery \"email\" mapping",
            "desc": "This is mapped value & logic for property email",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.urlPath",
            "actions": []
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
    "datasource": 12,
    "datasourceName": "a-rest-server-another-thing",
    "roles": [
      2
    ],
    "method": "get"
  }
}