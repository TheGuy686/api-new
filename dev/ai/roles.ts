import 'reflect-metadata';

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

const { exec } = require('shelljs');

exec(`copyfiles src/**/*.ezt src/**/*.ezt dist/`);

(async () => {

	

})();

console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');