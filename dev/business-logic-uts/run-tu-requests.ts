import 'reflect-metadata';

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

const { exec } = require('shelljs');

exec(`copyfiles src/**/*.ezt src/**/*.ezt dist/`);

import fs from 'fs';
import Request from '@eezze/classes/Request';

const path = require('path');

function readFilesInDirectory(directoryPath: string, out: string [] = []) {
	fs.readdirSync(directoryPath).forEach((file) => {
		const filePath = path.join(directoryPath, file);
		const stat = fs.statSync(filePath);
	
		if (stat.isFile()) {
			out.push(filePath);
		}
		else if (stat.isDirectory()) {
			readFilesInDirectory(filePath, out);
		}
	});

	return out;
}

(async () => {

    console.clear();

    await new Promise((res: any) => {
        setTimeout(() => res(), 2500);
    });

    const utsis = readFilesInDirectory(`${__dirname}/uts/decs`);

    const loginRes = (await Request.post('http://localhost:2002/v1/auth/login', {
        email: 'ryanjcooke@hotmail.com',
        password: 'Password123',
    }) as any).toObject().body;

    const token = `${loginRes.token}`;

    const total = utsis.length;

    let successful = 0, ran = 0;

    for (const uti of utsis) {
        const res = (await Request.put('http://localhost:2002/v1/service', require(uti).default, null, {
            authorization: token,
        }) as any).toObject();

        if (res.statusCode > 199 && res.statusCode < 300) {
            successful++;
        }
        else {
            console.log('Error: ', res);
        }

        ran++;

        // process.exit();
    }

    console.log(`\n\n       Successfully ran "${ran}" of "${total}"`);

    console.log(`\n\n       "${successful}" of "${total}" were successful\n\n`);

})();




console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');