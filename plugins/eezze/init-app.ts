import 'reflect-metadata';

const { exec } = require('shelljs');

// var log = console.log;
// console.log = function() {
//     log.apply(console, arguments);
//     console.trace();
// };

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

console.log(`RUNNING: "copyfiles src/**/*.ezt src/**/*.ezt dist/"`);

// exec(`cp plugins/eezze/services/*.js dist/plugins/eezze/services/`);
exec(`copyfiles src/**/*.ezt src/**/*.ezt dist/`);
exec(`copyfiles src/**/*.json src/**/*.json dist/`);
exec(`copyfiles src/**/*.yaml src/**/*.yaml dist/`);