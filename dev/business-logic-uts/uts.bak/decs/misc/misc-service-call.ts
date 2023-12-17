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
          "action": "service-call"
        },
        "datasource": 1,
        "repo": "DefaultMysqlDB.Default",
        "type": "rest",
        "service": 14,
        "actionListSource": {
          "example": "",
          "id": "92abKgZi6t",
          "property": "actionListSource",
          "name": "Propery \"actionListSource\" mapping",
          "desc": "This is mapped value & logic for property actionListSource",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.fullUrl",
          "actions": []
        },
        "headers": [
          {
            "example": "",
            "id": "mX0nXFTxcC",
            "property": "authentication",
            "name": "Propery \"adfadf\" mapping",
            "desc": "This is mapped value & logic for property adfadf",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.method",
            "actions": []
          }
        ],
        "urlParams": [
          {
            "example": "",
            "id": "i0GUjzC5op",
            "property": "ryan",
            "name": "Propery \"ryan\" mapping",
            "desc": "This is mapped value & logic for property ryan",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.host",
            "actions": []
          }
        ],
        "requestBody": [
          {
            "example": "",
            "id": "4je5sIMafo",
            "property": "cooke",
            "name": "Propery \"cooke\" mapping",
            "desc": "This is mapped value & logic for property cooke",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.requestHeaders.fasdfasdf",
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
    "roles": [
      2
    ],
    "method": "get"
  }
}