export default {
    "actionInput": [
        {
            "type": "text",
            "props": [
                {
                    "id": "action-0",
                    "raw": "adm.request.requestBody.projectId",
                    "desc": "New Item Default Desc",
                    "name": "New Item Default",
                    "type": "text",
                    "setSrc": "cmMdl->adm.request.requestBody.projectId",
                    "actions": [],
                    "example": "",
                    "baseType": "context-mapping",
                    "filterId": "3LGqaIs6Nx",
                    "property": "input"
                }
            ],
            "message": "ExecUnitTest \"projectId\" was not set",
            "metadata": {
                "regex": "",
                "valut": ""
            },
            "property": "projectId",
            "required": true,
            "valutKey": "",
            "additionalHeaders": []
        },
        {
            "type": "text",
            "props": [
                {
                    "raw": "adm.request.requestBody.host",
                    "desc": "This is mapped value & logic for property input",
                    "name": "Propery \"input\" mapping",
                    "type": "text",
                    "setSrc": "cmMdl->adm.request.requestBody.host",
                    "actions": [],
                    "example": "",
                    "baseType": "context-mapping",
                    "filterId": "UyzPKaCt5e",
                    "property": "input"
                }
            ],
            "message": "ExecUnitTest \"host\" was not set",
            "metadata": {
                "regex": "",
                "valut": ""
            },
            "property": "host",
            "required": true,
            "valutKey": "",
            "additionalHeaders": []
        },
        {
            "type": "text",
            "props": [
                {
                    "raw": "adm.request.requestBody.port",
                    "desc": "This is mapped value & logic for property input",
                    "name": "Propery \"input\" mapping",
                    "type": "text",
                    "setSrc": "cmMdl->adm.request.requestBody.port",
                    "actions": [],
                    "example": "",
                    "baseType": "context-mapping",
                    "filterId": "815bPvYekA",
                    "property": "input"
                }
            ],
            "message": "ExecUnitTest \"port\" was not set",
            "metadata": {
                "regex": "",
                "valut": ""
            },
            "property": "port",
            "required": true,
            "valutKey": "",
            "additionalHeaders": []
        },
        {
            "type": "text",
            "props": [
                {
                    "raw": "adm.request.requestBody.uts",
                    "desc": "This is mapped value & logic for property input",
                    "name": "Propery \"input\" mapping",
                    "type": "text",
                    "setSrc": "cmMdl->adm.request.requestBody.uts",
                    "actions": [],
                    "example": "",
                    "baseType": "context-mapping",
                    "filterId": "kX87dyU1Nx",
                    "property": "input"
                }
            ],
            "message": "ExecUnitTest \"uts\" was not set",
            "metadata": {
                "regex": "",
                "valut": ""
            },
            "property": "unitTests",
            "required": false,
            "valutKey": "",
            "additionalHeaders": []
        }
    ],
    "logic": [
      {
          "id": "35",
          "name": "Action #1",
          "type": "text",
          "isNew": true,
          "output": [],
          "schema": {
              "_action": {
                  "action": "command",
                  "category": "misc"
              },
              "command": {
                  "id": "XOSZCzAhUc",
                  "raw": "",
                  "desc": "This is mapped value & logic for property command",
                  "name": "Propery \"command\" mapping",
                  "type": "text",
                  "actions": [
                      {
                          "id": "0BPoQLOLEd",
                          "name": "Action 1",
                          "type": "string",
                          "actions": [
                              {
                                  "id": "tO7Yau3CZX",
                                  "name": "Logic item \"0\"",
                                  "type": "custom",
                                  "logic": {
                                      "raw": "const uts = (adm.input?.unitTests ?? '').split(',');\n\nlet cmdIns = `host=${adm.input.host} port=${adm.input.port} prId=${adm.input.projectId} `;\n\nif (uts.length > 0) cmdIns += `uts=${uts.join(',')}`;\n\nreturn `node ./plugins/eezze/unit-test/index.js ${cmdIns} > out.txt`;",
                                      "prop": "",
                                      "type": "",
                                      "opArgs": [],
                                      "source": "",
                                      "formula": "",
                                      "subtype": "",
                                      "variables": []
                                  },
                                  "actions": [],
                                  "returns": "text",
                                  "filterId": "rtBRGfM0uu"
                              }
                          ],
                          "filterId": "Q4IpQJi8yl",
                          "property": "filename"
                      }
                  ],
                  "example": "",
                  "baseType": "logic-chain",
                  "filterId": "zPAyBQZzTO",
                  "property": "command"
              },
              "rootFolder": "",
              "runAsynchronous": false
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
    "serviceGroupId": 26,
    "type": "websocket",
    "name": "Exev Unit Test",
    "description": "This service will execute the unit tests",
    "definition": {
      "datasource": "",
      "datasourceName": "",
      "eventType": "broadcast",
      "eventName": "exec-unit-tests",
      "channel": {
        "example": "",
        "id": "CZKI2vLR1I",
        "filterId": "sOTRV2jOts",
        "property": "channel",
        "name": "Propery \"channel\" mapping",
        "desc": "This is mapped value & logic for property channel",
        "baseType": "logic-chain",
        "type": "text",
        "raw": "",
        "actions": [
          {
            "id": "USWjBJ5Oyu",
            "filterId": "B2IuQAtszw",
            "property": "channel",
            "name": "Action 1",
            "type": "string",
            "actions": [
              {
                "id": "8o3MtFafOl",
                "filterId": "UqsEx8v4FL",
                "type": "custom",
                "name": "Returns the project id to the channel",
                "logic": {
                  "raw": "return `pr-${adm.input?.projectId}`;",
                  "formula": "",
                  "source": "",
                  "prop": "",
                  "type": "",
                  "subtype": "",
                  "variables": [],
                  "opArgs": []
                },
                "returns": "text",
                "actions": []
              }
            ]
          }
        ]
      }
    }
}