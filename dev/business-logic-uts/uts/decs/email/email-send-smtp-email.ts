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
          "category": "email",
          "action": "send-smtp-email"
        },
        "datasource": 1,
        "repo": "DefaultMysqlDB.Default",
        "to": {
          "example": "",
          "id": "qtVEwCBryE",
          "property": "to",
          "name": "Propery \"to\" mapping",
          "desc": "This is mapped value & logic for property to",
          "baseType": "primitive",
          "type": "text",
          "raw": "ryanjcooke@hotmail.com, ryanwesley@hotmail.com",
          "actions": []
        },
        "from": {
          "example": "",
          "id": "b2XSby3JXW",
          "property": "from",
          "name": "Propery \"from\" mapping",
          "desc": "This is mapped value & logic for property from",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.requestBody.ryansfromEmail",
          "actions": []
        },
        "subject": {
          "example": "",
          "id": "zyH4mJdlYo",
          "property": "subject",
          "name": "Propery \"subject\" mapping",
          "desc": "This is mapped value & logic for property subject",
          "baseType": "context-mapping",
          "type": "text",
          "raw": "adm.request.urlPath",
          "actions": []
        },
        "template": 1,
        "templateVars": [
          {
            "example": "",
            "id": "Ews0iGiPG6",
            "property": "firstName",
            "name": "Propery \"firstName\" mapping",
            "desc": "This is mapped value & logic for property firstName",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.method",
            "actions": []
          },
          {
            "example": "",
            "id": "JxtwczrmId",
            "property": "lastName",
            "name": "Propery \"lastName\" mapping",
            "desc": "This is mapped value & logic for property lastName",
            "baseType": "context-mapping",
            "type": "text",
            "raw": "adm.request.host",
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