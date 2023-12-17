import 'reflect-metadata';

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

const data = require('./uts/advanced4').default;
const ents = require('./uts/entities').default;

import MenuState from './MenuState';

(async () => {

    // console.clear();
    console.clear();

    const ms = new MenuState(data, ents, false, false);

    const startTime = new Date().getTime();

    // 47rUtWHEk3, zqifemqSqw, 

    // const menu = ms.output('action-0-logic-1-logic-2');
    // const menu = ms.output('47rUtWHEk3');
    // const menu = ms.output('zqifemqSqw-close');
    // const menu = ms.output('action-0-logic-4');
    const menu = ms.output();

    console.log('MENU OUTPUT: ', JSON.stringify(menu, null, 4));

    const endTime = new Date().getTime();
    const elapsedTime = endTime - startTime;

    console.log('Time taken (ms):', elapsedTime);

})();