import os from 'node:os';

import fs from 'fs';

const exec = require('node:child_process').execSync;

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

        const path = `${os.tmpdir()}/eezze/eezze-con-stats-${conId}.enc`;

        const res = fs.readFileSync(path);

        console.log(res.toString() ?? '');
    }
    catch (err) {
        console.log(err);
    }

})();