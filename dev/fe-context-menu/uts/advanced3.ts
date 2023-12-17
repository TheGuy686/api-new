export default {
  "actionInput": [
    {
      "id":"8Ndy4iZAoe",
      "raw":"adm.request.host",
      "desc":"",
      "name":"",
      "type":"date",
      "actions":[],
      "example":"",
      "baseType":"context-mapping",
      "property":"ryansInput"
    }
  ],
  "logic": [
    {
      "output": [
        {
          "id":"8Ndy4iZAoe",
          "filterId":"8Ndy4iZAoe",
          "raw":"adm.request.host",
          "desc":"",
          "name":"",
          "type":"date",
          "actions":[],
          "example":"",
          "baseType":"context-mapping",
          "property":"ryansOutput"
        }
      ],
      "isNew": true,
      "id": "78",
      "type": "text",
      "name": "Action #1",
      "description": "Action #1 Description",
      "schema": {
        "_action": {
          "category": "database",
          "action": "get-one-and-update"
        },
        "datasource": "",
        "entity": "",
        "repo": ".",
        "checkOn": [
          "ryan"
        ],
        "input": [
          {
            "example": "",
            "id": "Xvt2vPQIP0",
            "filterId": "z8njI6apjM",
            "property": "ryan",
            "name": "Propery \"ryan\" mapping",
            "desc": "This is mapped value & logic for property ryan",
            "baseType": "logic-chain",
            "type": "text",
            "raw": "",
            "actions": [
              {
                "id": "l1NrR9gaFN",
                "filterId": "2pIZNJ5Qko",
                "property": "filename",
                "name": "Action 1",
                "type": "string",
                "actions": [
                  {
                    "id": "VsKkj8J1Zy",
                    "filterId": "5M3iZj3v3m",
                    "type": "number-operation",
                    "name": "Logic item \"0\"",
                    "logic": {
                      "subtype": "calculation",
                      "formula": "78*9",
                      "raw": "78*9",
                      "resultPreview": 702,
                      "variables": {},
                      "spanPreview": "<span>7</span><span>8</span><span>x</span><span>9</span>",
                      "prop": ""
                    },
                    "returns": "string",
                    "actions": []
                  },
                  {
                    "id": "v8XHuTx1h0",
                    "filterId": "32CjHzRIOI",
                    "type": "assign-values",
                    "name": "Logic item \"1\"",
                    "logic": {
                      "raw": "",
                      "formula": "",
                      "source": "",
                      "prop": "",
                      "type": "",
                      "subtype": "",
                      "variables": [],
                      "opArgs": []
                    },
                    "returns": "string",
                    "actions": [
                      {
                        "id": "s0ngs3thzd",
                        "filterId": "IUojDcuKod",
                        "type": "assign-primitive",
                        "logic": {
                          "subtype": "text",
                          "prop": "a1",
                          "format": "",
                          "formula": "",
                          "source": "",
                          "example": "",
                          "raw": "fsfdg",
                          "opArgs": [],
                          "variables": []
                        },
                        "returns": "text",
                        "actions": []
                      },
                      {
                        "id": "3hfYL4omBU",
                        "filterId": "roUI6geqEP",
                        "type": "assign-primitive",
                        "logic": {
                          "subtype": "text",
                          "prop": "a2",
                          "format": "",
                          "formula": "",
                          "source": "",
                          "example": "",
                          "raw": "asdfasdf",
                          "opArgs": [],
                          "variables": []
                        },
                        "returns": "text",
                        "actions": []
                      }
                    ]
                  },
                  {
                    "id": "hydmNqaBZ7",
                    "filterId": "P4Ir2go3Bs",
                    "type": "formatter",
                    "name": "Logic item \"2\"",
                    "logic": {
                      "subtype": "string-interpolate",
                      "raw": "asdf ${1}",
                      "formula": "asdf ryan",
                      "format": "",
                      "source": "",
                      "prop": "",
                      "variables": [
                        {
                          "pos": 1,
                          "id": 1,
                          "color": "#295004",
                          "format": {},
                          "value": "adm.something",
                          "example": "ryan"
                        }
                      ],
                      "opArgs": []
                    },
                    "returns": "text",
                    "actions": []
                  }
                ]
              }
            ]
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
  "id": 17,
  "projectId": 1,
  "serviceGroupId": 11,
  "type": "rest",
  "name": "adsfasdf",
  "description": "sdafasdf",
  "definition": {
    "path": "asdfasdf",
    "roles": [
      13
    ],
    "method": "post"
  }
}