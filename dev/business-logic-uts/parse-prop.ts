import 'reflect-metadata';

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

const { exec } = require('shelljs');

exec(`copyfiles src/**/*.ezt src/**/*.ezt dist/`);

import fs from 'fs';
import Logger from '@eezze/classes/Logger';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import EezzeRequest from '@eezze/classes/EezzeRequest';
import ETpl from '@eezze/classes/logic/render-templates';

const REQ_DUMMY = {
	method: 'GET',
	get(key: string) {
		switch (key) {
			case 'host': return 'localhost';
		}
	},
	connection: {
		remoteAddress: '192.168.2.125',
	},
	protocol: 'http',
	originalUrl: '?ryan=1',
	headers: {
		accept: [ 'json' ],
	},
	query: {
		ryan: 1,
	},
	body: '',
};

console.clear();

console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');

const path = require('path');

const logger = new Logger('bl-ut-dev-process');

// var log = console.log;

// console.log = function() {
//     log.apply(console, arguments);
// };

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

function getTemplates() {
	const path = `${__dirname}/tpls/`;

	const templates: any = {};

	readFilesInDirectory(path).forEach((tpl: string) => {
		if (!/\.ezt$/.test(tpl)) {
			throw `"${tpl}" has a wrong extention. Expected ".ezt"`;
		}

		const matches: any = tpl.match(/([a-zA-Z0-9-\.]+\.ezt)$/);

		templates[matches[1]] = fs.readFileSync(tpl).toString();
	});

	return templates;
}

function getAdm() {
	const data = {};
	const req = new EezzeRequest({
		...REQ_DUMMY,
		body: data
	}, {}, logger);
	const adm = new ActionDataManager(req, logger);

	adm.setInput(req.requestBody);

	adm.request.auth.setUser({
		id: 1,
		email: 'ryanjcooke@hotmail.com',
		firstName: 'Ryan',
		lastName: 'Cooke',
		age: 36,
	});
	adm.request.auth.setUser('allkkdihlekjrieuhfksjdisdjkfisdfhklj');
	adm.request.auth.setRoles([ 'ROLE_USER', 'ROLE_ADMIN' ]);

	return adm;
}

(async () => {

	const adm = getAdm();

	const templates = getTemplates();

	const data = require('./uts/prop').default;

	const res = await ETpl.render(adm, {
		cache: false,
		templateName: 'test-variable-context-prop',
		prettify: true,
		toPath: `${__dirname}/output/prop.ts`,
		templateVars: (adm: ActionDataManager) => ({
			input: data,
		}),
		templates: templates,
	}, logger);

	console.log(`\n\n           Process was successful`);

})();



console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');