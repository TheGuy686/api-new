const { compress } = require('shrink-string');

const exec = require('node:child_process').execSync;

// const os = require('os');

import os from 'node:os';

import fs from 'fs';

import SystemInfo from '../classes/SystemInfo';

console.clear();

(async () => {
    try {
        let conId;

        for  (const a of process.argv) {
            const matches = a.match(/^con-id=(.*?)$/);
            if (!matches) continue;
            conId = matches[1];
        }

        if (!conId) {
            console.log(`Couldn't find the connection id "con-id" param. Expreced "con-id=$\{CON-ID}"`);
            process.exit(1);
        }

        const eezzeTmp = `${os.tmpdir()}/docker-mnts/eezze`;

        if (!fs.existsSync(eezzeTmp)) {
            exec(`mkdir ${eezzeTmp}`);
            exec(`chmod 777 -R ${eezzeTmp}`);
        }

        const path = `${eezzeTmp}/eezze-con-stats-${conId}.enc`;

        const res = await SystemInfo.serialize();

        const json = JSON.stringify(res);

        const out = await compress(json);

        fs.writeFileSync(path, out.trim());

        // console.log(`Save path "${path}"`);

        exec(`chmod 777 ${path}`);
    }
    catch (err) {
        console.log(err);
    }

})();