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

    console.clear();

    const port = process.argv[1];

    console.log('process.argv: ', process.argv);

    if (typeof port == 'number' || !/[0-9]+/.test(port)) {
        process.exit();
    }

    let host = 'localhost';

    if (typeof process.argv[2] == 'string') {
        host = process.argv[2];
    }

    const cmd = `telnet ${host} ${port}`;

    console.log(`Running "${cmd}"`);

    console.log(exec(cmd).stdout);

})();