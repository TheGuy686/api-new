import 'reflect-metadata';

const { exec } = require('shelljs');

// var log = console.log;
// console.log = function() {
//     log.apply(console, arguments);
//     console.trace();
// };

require('module-alias/register');
require('dotenv-json')({ path: '../.env.json' });
require('source-map-support').install();

(async () => {

    

})();


// {"event":"project-logging-channel","data":{"projectId":1}}

// {
//     "event": "Log",
//     "data": {
//         "projectId": 1,
//         "data": {
//             "id": "2pZtQAkQn7",
//             "sourceRequestId": "",
//             "time": { 
//                 "from": 1685355408794, 
//                 "to": 1685355414251, 
//                 "duration": 5457
//             },
//             "level": "INFO",
//             "type": "generation_ws_logging_server",
//             "callSrc": "na",
//             "sourceIp": "172.18.0.1",
//             "message": "\"Mon May 29 2023 10:16:54 GMT+0000 (Coordinated Universal Time)\" Received a new connection from origin \"0.0.0.0:3100\"",
//             "requestMetadata": "{}",
//             "createdAt": 1685355414251,
//             "urlPath": "na",
//             "method": "na"
//         }
//     }
// }

