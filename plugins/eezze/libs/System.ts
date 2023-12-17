const ip = require('ip');

import SystemInfo from '../classes/SystemInfo';

export default class System {
    static ip() {

        // (async () => {

        //     console.log(await SystemInfo.netInterfaces());

        // })();

        return ip.address();
    }
}