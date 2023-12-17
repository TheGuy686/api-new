export default {
  "actionInput": [
    {
      "id": "2KJ2nwwJVM",
      "raw": "adm.request.fullUrl",
      "desc": "",
      "name": "",
      "type": "text",
      "actions": [],
      "example": "",
      "baseType": "context-mapping",
      "filterId": "bzl7Pz8dqR",
      "property": "email"
    }
  ],
  "logic": [
    {
      "id": "80",
      "name": "Action #1",
      "type": "text",
      "isNew": true,
      "output": [],
      "schema": {
        "repo": "DefaultMysqlDB.",
        "entity": "",
        "_action": {
          "action": "create-one",
          "category": "database"
        },
        "datasource": "DefaultMysqlDB"
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
  "id": 20,
  "projectId": 1,
  "serviceGroupId": 11,
  "type": "websocket",
  "name": "hello there WS 2",
  "description": "asdfasdfasdf",
  "definition": {
    "datasource": 9,
    "datasourceName": "a-rest-server",
    "eventType": "broadcast",
    "eventName": "event-name",
    "channel": {
      "example": "",
      "id": "WVcZ2jVeuI",
      "filterId": "jzecsTDip2",
      "property": "channel",
      "name": "Propery \"channel\" mapping",
      "desc": "This is mapped value & logic for property channel",
      "baseType": "context-mapping",
      "type": "text",
      "raw": "lc.prop('ryan')",
      "actions": []
    }
  }
}