import 'reflect-metadata';

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

const { exec } = require('shelljs');

exec(`copyfiles src/**/*.ezt src/**/*.ezt dist/`);

import Normalizer from './classes/normalizer';

console.clear();

import dummy from './test-text';

(async () => {

    console.time('process-time');

    const res = Normalizer.run(dummy.text);

	console.log(res);

    console.timeEnd('process-time');
    
})();

console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');