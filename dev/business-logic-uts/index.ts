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
import File from '@eezze/classes/logic/file';

import { kebabCase, camelCase, pascalCase } from '../../plugins/eezze/libs/StringMethods';

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

function getTemplates() {
	const path = `${__dirname}/../../src/service-configurables/`;

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

function getAdm(uti: string) {
	const data = require(uti).default;
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

	const utsis = readFilesInDirectory(`${__dirname}/uts`);

	// const templates: any = {
	// 	'action.index.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/action.index.ezt`).toString(),
	// 	'action-properties-entry.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/action-properties-entry.ezt`).toString(),
	// 	'action-properties.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/action-properties.ezt`).toString(),
	// 	'action-recursion.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/action-recursion.ezt`).toString(),
	// 	'action.dec-imports.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/action.dec-imports.ezt`).toString(),
	// 	'database-get-one-and-update.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/database-get-one-and-update.ezt`).toString(),
	// 	'database-delete-one.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/database-delete-one.ezt`).toString(),
	// 	'files-save.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/files-save.ezt`).toString(),
	// 	'email-send-smtp-email.ezt': fs.readFileSync(`${__dirname}/../../src/service-configurables/render-templates/email-send-smtp-email.ezt`).toString(),
	// };

	const succs: any[] = [], errors: any[] = [];

	const templates = getTemplates();

	for (const uti of utsis) {
		const adm = getAdm(uti);
		const matches: any = uti.match(/([a-zA-Z]+)\/([a-zA-Z0-9-]+)\.ts$/);

		const tv = (adm: ActionDataManager) => {
			try {
				return {
					targetRepo: pascalCase((adm.input?.repo ?? '').replace(/Repo$/, '').replace(/Repository$/, '')),
					serviceGroup: kebabCase(adm.input?.serviceGroup),
					name: camelCase(adm.input?.name),
					description: adm.input?.description,
					roles: adm.input?.roles ?? [],
					logic: adm.input?.logic ?? {},
					condition: adm.input?.condition,
				};
			}
			catch (err) {
				console.log('Error: ', err);
				return {};
			}
		};

		const type = kebabCase(matches[1]);
		const _path = `${__dirname}/output/${type}`;

		if (!fs.existsSync(_path)) fs.mkdirSync(_path);

		try {
			const res = await ETpl.render(adm, {
				cache: false,
				template: 'action.index',
				prettify: true,
				templateVars: tv,
			}, logger);
	
			await fs.writeFileSync(
				`${__dirname}/output/${type}/${type}-${kebabCase(matches[2])}.ts`,
				res,
			);
	
			succs.push(`${__dirname}/output/${type}/${type}-${kebabCase(matches[2])}.ts`);

			// console.log(`Saved tpl to "${__dirname}/output/${type}/${type}-${kebabCase(matches[2])}.ts"`);
		}
		catch (err) {
			errors.push({
				template: `${type}-${kebabCase(matches[2])}.ts`,
				error: err?.message ?? err,
			});
		}
	}

	console.log(`\n\n           Process was successful`);

	if (errors.length > 0) {
		console.log(`\n\n\ ERRORS: `);
		console.log(errors);
	}

})();

console.log('                    ');
console.log('                    ');
console.log('                    ');
console.log('                    ');