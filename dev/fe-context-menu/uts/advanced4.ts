export default {
  "actionInput": [
    {
      "id": "8Ndy4iZAoe",
      "raw": "",
      "desc": "",
      "name": "",
      "type": "date",
      "actions": [
        {
          "id": "action-0",
          "name": "Action 1",
          "type": "string",
          "actions": [
            {
              "id": "action-0-logic-0",
              "name": "Logic item \"0\"",
              "type": "custom",
              "logic": {
                "raw": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nadsfasdf\n\n\n\n\n\n\n\n\n",
                "prop": "",
                "type": "",
                "opArgs": [],
                "source": "",
                "formula": "",
                "subtype": "",
                "variables": []
              },
              "actions": [],
              "returns": "string"
            }
          ],
          "property": "adsfasdf"
        }
      ],
      "example": "",
      "baseType": "logic-chain",
      "property": "adsfasdf"
    }
  ],
  "logic": [
    {
      "id": "11",
      "name": "Action #1",
      "type": "text",
      "isNew": false,
      "output": [],
      "schema": {
        "repo": "Dfghdfgh.",
        "input": [
          {
            "id": "MP1KjlUOJL",
            "raw": "",
            "desc": "This is mapped value & logic for property ryan",
            "name": "Propery \"ryan\" mapping",
            "type": "text",
            "actions": [
              {
                "id": "cridQDcplR",
                "name": "Action 1",
                "type": "string",
                "actions": [
                  {
                    "id": "7tu7JAEbn2",
                    "name": "Logic item \"0\"",
                    "type": "assign-values",
                    "logic": {
                      "raw": "",
                      "prop": "",
                      "type": "",
                      "opArgs": [],
                      "source": "",
                      "formula": "",
                      "subtype": "",
                      "variables": []
                    },
                    "actions": [
                      {
                        "id": "X3qGPc8yid",
                        "type": "assign-primitive",
                        "logic": {
                          "raw": "erwr",
                          "prop": "a1",
                          "format": "",
                          "opArgs": [],
                          "source": "",
                          "example": "",
                          "formula": "",
                          "subtype": "text",
                          "variables": []
                        },
                        "actions": [],
                        "returns": "text",
                        "filterId": "txHcidmWcJ"
                      },
                      {
                        "id": "oqC8CDrVJR",
                        "type": "assign-primitive",
                        "logic": {
                          "raw": "werwer",
                          "prop": "a2",
                          "format": "",
                          "opArgs": [],
                          "source": "",
                          "example": "",
                          "formula": "",
                          "subtype": "text",
                          "variables": []
                        },
                        "actions": [],
                        "returns": "text",
                        "filterId": "XXNZnxBlPG"
                      }
                    ],
                    "returns": "string",
                    "filterId": "fqNS8XYmjr"
                  },
                  {
                    "id": "xrnWleQCjW",
                    "name": "Logic item \"1\"",
                    "type": "list-process",
                    "logic": {
                      "raw": "asfasdf",
                      "prop": "",
                      "type": "",
                      "opArgs": [],
                      "source": "",
                      "formula": "",
                      "subtype": "",
                      "variables": []
                    },
                    "actions": [
                      {
                        "id": "Tx8jCbdok1",
                        "name": "Logic item \"0\"",
                        "type": "assign-values",
                        "logic": {
                          "raw": "",
                          "prop": "",
                          "type": "",
                          "opArgs": [],
                          "source": "",
                          "formula": "",
                          "subtype": "",
                          "variables": []
                        },
                        "actions": [
                          {
                            "id": "JVnaV53Grw",
                            "type": "",
                            "logic": {
                              "raw": "",
                              "prop": "b2",
                              "variables": []
                            },
                            "actions": [],
                            "returns": "string",
                            "filterId": "CbnLUhppw6"
                          },
                          {
                            "id": "Ky4Y17f7zE",
                            "type": "assign-primitive",
                            "logic": {
                              "raw": "dfgsdfg",
                              "prop": "b3",
                              "format": "",
                              "opArgs": [],
                              "source": "",
                              "example": "",
                              "formula": "",
                              "subtype": "text",
                              "variables": []
                            },
                            "actions": [],
                            "returns": "text",
                            "filterId": "PXxEXSwA08"
                          }
                        ],
                        "returns": "string",
                        "filterId": "vz58gMB2OF"
                      }
                    ],
                    "returns": "string",
                    "filterId": "8uo20m2A3b"
                  }
                ],
                "filterId": "rkwPsRFqCp",
                "property": "filename"
              }
            ],
            "example": "",
            "baseType": "logic-chain",
            "filterId": "1pWlQZqSWh",
            "property": "ryan"
          }
        ],
        "entity": "",
        "_action": {
          "action": "create-one",
          "category": "database"
        },
        "datasource": "Dfghdfgh"
      },
      "errorCode": 400,
      "description": "Action #1 Description",
      "successCode": 201,
      "errorMessage": "Error message",
      "successMessage": "Success message MAIN ERROR"
    },
    {
      "id": "81",
      "name": "Action #2",
      "type": "text",
      "isNew": true,
      "output": [
        {
          "id": "UgS57jtZUM",
          "raw": "",
          "desc": "",
          "name": "",
          "type": "text",
          "actions": [
            {
              "id": "ssQbVoLS3V",
              "name": "Action 1",
              "type": "string",
              "actions": [
                {
                  "id": "fC4kW9SN9z",
                  "name": "Logic item \"0\"",
                  "type": "formatter",
                  "logic": {
                    "raw": "hello there ${1}",
                    "prop": "",
                    "format": "",
                    "opArgs": [],
                    "source": "",
                    "formula": "hello there gW87h",
                    "subtype": "string-interpolate",
                    "variables": [
                      {
                        "id": 1,
                        "pos": 1,
                        "color": "#6fbea3",
                        "value": "adm.ryan",
                        "format": {},
                        "example": "gW87h"
                      }
                    ]
                  },
                  "actions": [],
                  "returns": "text",
                  "filterId": "JMtbOR5qyQ"
                }
              ],
              "filterId": "T8VMuq3Wvv",
              "property": ""
            }
          ],
          "example": "",
          "baseType": "logic-chain",
          "filterId": "ahIpUYueFC",
          "property": ""
        }
      ],
      "schema": {
        "repo": "",
        "entity": 12,
        "_action": {
          "action": "update-one",
          "category": "database"
        },
        "datasource": "DefaultMysqlDB",
        "withValues": [],
        "maximumDepth": 4
      },
      "errorCode": 400,
      "description": "Action #2 Description",
      "successCode": 200,
      "errorMessage": "Error message",
      "successMessage": "Success message"
    },
    {
      "id": "73",
      "name": "Action #3",
      "type": "text",
      "isNew": true,
      "output": [
        {
          "id": "mqUtfJSu0D",
          "raw": "",
          "desc": "",
          "name": "",
          "type": "text",
          "actions": [
            {
              "id": "RhSTY68LQu",
              "name": "Action 1",
              "type": "string",
              "actions": [
                {
                  "id": "Emqdf9BP6H",
                  "name": "Logic item \"0\"",
                  "type": "formatter",
                  "logic": {
                    "raw": "Now from here \"\"${1}",
                    "prop": "",
                    "format": "",
                    "opArgs": [],
                    "source": "",
                    "formula": "Now from here \"\"b0vN2",
                    "subtype": "string-interpolate",
                    "variables": [
                      {
                        "id": 1,
                        "pos": 1,
                        "color": "#bf448a",
                        "value": "adm.cooke",
                        "format": {},
                        "example": "b0vN2"
                      }
                    ]
                  },
                  "actions": [],
                  "returns": "text",
                  "filterId": "h6qFK7dKuc"
                }
              ],
              "filterId": "MoFFNlfK8L",
              "property": ""
            }
          ],
          "example": "",
          "baseType": "logic-chain",
          "filterId": "hA8yPR4hjq",
          "property": ""
        }
      ],
      "schema": {
        "repo": "",
        "entity": 20,
        "_action": {
          "action": "delete-one",
          "category": "database"
        },
        "datasource": "DefaultMysqlDB"
      },
      "errorCode": 400,
      "description": "Action #3 Description",
      "successCode": 200,
      "errorMessage": "Error message",
      "successMessage": "Success message"
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
    "method": "get",
    "condition": {
      "id": "1YOqowltxy",
      "raw": "",
      "desc": "This is mapped value & logic for property condition",
      "name": "Propery \"condition\" mapping RYAN",
      "type": "text",
      "actions": [
        {
          "id": "action-0",
          "name": "Action 1",
          "type": "string",
          "actions": [
            {
              "id": "action-0-logic-0",
              "name": "Logic item \"0\"",
              "type": "custom",
              "logic": {
                "raw": "adfasdfa",
                "prop": "",
                "type": "",
                "opArgs": [],
                "source": "",
                "formula": "",
                "subtype": "",
                "variables": []
              },
              "actions": [],
              "returns": "string"
            }
          ],
          "property": "condition"
        }
      ],
      "example": "",
      "baseType": "logic-chain",
      "property": "condition"
    }
  }
}