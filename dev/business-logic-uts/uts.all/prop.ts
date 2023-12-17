export default [
  {
    "id": "EPu3FpXCWi",
    "raw": "",
    "desc": "This is mapped value & logic for property email",
    "name": "Propery \"email\" mapping",
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
                        "raw": "\nreturn Number('0.23531');\n",
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
            "property": "filename"
        },
        {
            "id": "action-1",
            "name": "Action 2",
            "type": "string",
            "actions": [
              {
                "id": "action-1-logic-0",
                "name": "Logic item \"0\"",
                "type": "custom",
                "logic": {
                  "raw": "\nconsole.log('hello again ryan');\n",
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
              },
              {
                "id": "action-1-logic-1",
                "name": "Logic item \"1\"",
                "type": "number-operation",
                "logic": {
                  "raw": "7*9${1}9*6",
                  "prop": "",
                  "formula": "7*9${1}9*6",
                  "subtype": "calculation",
                  "variables": {
                    "v1": {
                      "pos": 1,
                      "alias": "${1}",
                      "color": "#6a4b34",
                      "value": "adm.request.fullUrl",
                      "example": 10
                    }
                  },
                  "spanPreview": "<span>7</span><span>x</span><span>9</span><span style=\"color: #6a4b34;\">${1}</span><span>9</span><span>x</span><span>6</span>",
                  "resultPreview": 382578
                },
                "actions": [],
                "returns": "string"
              },
              {
                "id": "action-1-logic-2",
                "name": "Logic item \"2\"",
                "type": "number-operation",
                "logic": {
                  "raw": "",
                  "prop": "",
                  "type": "",
                  "opArgs": [
                    {
                      "value": "adm.request.urlPath",
                      "example": 51
                    },
                    {
                      "value": "adm.request.method",
                      "example": 31
                    }
                  ],
                  "source": "",
                  "formula": "",
                  "subtype": "addition",
                  "variables": []
                },
                "actions": [],
                "returns": "string"
              },
            ],
            "property": "filename"
        },
        {
            "id": "action-4",
            "property": "filename",
            "name": "Action 4",
            "type": "number",
            "actions": [
                {
                    "id": "action-1-logic-3",
                    "type": "custom",
                    "name": "Logic item \"3\"",
                    "logic": {
                        "raw": "\nfor (let i = 0; i < 10; i++) { console.log(`I \"${i}\"`) }\n",
                        "formula": "",
                        "source": "",
                        "prop": "",
                        "type": "",
                        "subtype": "",
                        "variables": [],
                        "opArgs": []
                    },
                    "returns": "string",
                    "actions": []
                }
            ]
        },
        {
            "id": "action-5",
            "name": "Action 5",
            "type": "string",
            "actions": [
              {
                "id": "action-5-logic-0",
                "name": "Logic item \"0\"",
                "type": "formatter",
                "logic": {
                  "raw": "This is an example \"${1}\" and here and there",
                  "prop": "",
                  "format": {},
                  "opArgs": [],
                  "source": "",
                  "formula": "",
                  "subtype": "string-interpolate",
                  "variables": [
                    {
                      "id": 1,
                      "pos": 1,
                      "color": "#1a8831",
                      "value": "adm.request.fullUrl",
                      "format": {},
                      "example": "bbsfW"
                    }
                  ]
                },
                "actions": [],
                "returns": "text"
              },
              {
                "id": "action-2-logic-1",
                "name": "Logic item \"1\"",
                "type": "formatter",
                "logic": {
                  "raw": "",
                  "prop": "",
                  "format": "YYYY-MM-DD hh:mm:ss",
                  "opArgs": [],
                  "source": "adm.request.method2",
                  "example": "2022-10-31 18:45:35",
                  "formula": "",
                  "subtype": "date-interpolate",
                  "variables": []
                },
                "actions": [],
                "returns": "text"
              },
              {
                "id": "action-2-logic-2",
                "name": "Logic item \"2\"",
                "type": "formatter",
                "logic": {
                  "raw": "this is a date ${1} of the ${2} month",
                  "prop": "",
                  "format": "custom",
                  "opArgs": [
                    {
                      "id": "arg-1",
                      "value": "1"
                    }
                  ],
                  "source": "adm.request.host",
                  "formula": "",
                  "subtype": "date-interpolate",
                  "variables": [
                    {
                      "id": 1,
                      "pos": 1,
                      "color": "#696b1a",
                      "value": "adm.request.method",
                      "format": {},
                      "example": "1"
                    },
                    {
                      "id": 2,
                      "pos": 2,
                      "color": "#919fb6",
                      "value": "",
                      "format": {
                        "group": "month",
                        "value": "Mo"
                      },
                      "example": "1st"
                    }
                  ]
                },
                "actions": [],
                "returns": "text"
              },
              {
                "id": "action-2-logic-13",
                "name": "Logic item \"13\"",
                "type": "formatter",
                "logic": {
                  "raw": "${1}${2}0.2",
                  "prop": "",
                  "format": {},
                  "opArgs": [],
                  "source": "",
                  "formula": "",
                  "subtype": "number",
                  "variables": [
                    {
                      "id": 1,
                      "pos": 1,
                      "color": "#53aba3",
                      "value": "adm.request.method",
                      "format": {},
                      "example": "25"
                    },
                    {
                      "id": 2,
                      "pos": 2,
                      "color": "#304671",
                      "value": "adm.request.urlPath",
                      "format": {},
                      "example": 48
                    }
                  ]
                },
                "actions": [],
                "returns": "number"
              },
              {
                "id": "action-2-logic-14",
                "name": "Logic item \"14\"",
                "type": "formatter",
                "logic": {
                  "raw": [
                    {
                      "key": "prop1",
                      "data": [],
                      "value": "adm.request.method2",
                      "returns": "text"
                    },
                    {
                      "key": "prop3",
                      "data": [
                        {
                          "key": "prop4",
                          "data": [
                            {
                              "key": "prop6",
                              "data": [],
                              "value": "adm.request.method",
                              "returns": "text"
                            }
                          ],
                          "value": "",
                          "returns": "object"
                        },
                        {
                          "key": "prop7",
                          "value": "",
                          "returns": "text",
                          "data": [
                            {
                                "key": "proP78",
                                "value": "",
                                "returns": "text",
                                "data": [
                                    {
                                        "key": "prop7845",
                                        "data": [],
                                        "value": "adm.request.fullUrl",
                                        "returns": "text"
                                      }
                                ],
                            }
                          ],
                        }
                      ],
                      "value": "",
                      "returns": "object"
                    }
                  ],
                  "prop": "",
                  "format": {},
                  "opArgs": [],
                  "source": "",
                  "formula": "",
                  "subtype": "object",
                  "variables": []
                },
                "actions": [],
                "returns": "number"
              }
            ],
            "property": "filename"
        }
    ],
    "example": "",
    "baseType": "logic-chain",
    "property": "email"
  }
]