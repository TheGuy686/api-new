import 'reflect-metadata';

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

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

    await new Promise((res: any) => setTimeout(() => res(), 2500));

    const loginRes = (await Request.post('http://localhost:2002/v1/auth/login', {
        email: 'ryanjcooke@hotmail.com',
        password: 'Password123',
    }) as any).toObject().body;

	const token = loginRes.token;

	if (!token) {
		console.log('LOGIN unsuccessful: ', loginRes);
		return;
	}

	const getUserRes = (await Request.get(`http://localhost:2002/v1/auth/user?authorization=${token}`, {}, null, {
		authorization: token,
	}) as any).toObject().body;

    console.log('Get user res: ', getUserRes);

})();

console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');