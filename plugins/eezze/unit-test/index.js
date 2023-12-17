require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

const fs = require('fs');

console.clear();

const RestUnitTest = require('./rest-unit-test');
const WsUnitTest = require('./ws-unit-test');

const EezzeRequest = require('@eezze/classes/EezzeRequest').default;
const Logger = require('@eezze/classes/Logger').default;
const ADM = require('@eezze/classes/ActionDataManager').default;
const path = require('path');

let LGR = '';

function readFilesInDirectory(directoryPath, out = []) {
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

function getUnitTests(uts) {
    const files = readFilesInDirectory(`${__dirname}/../../../dist/src`);

    const ffs = files.filter((f) => {
        return /unit-test/.test(f) && /\.js$/.test(f) && /src\/services\//.test(f);
    });

    const out = { rest: [], ws: [], crons: [] };

    if (Array.isArray(uts) && uts.length > 0) {
        // loop through each file in the folder
        for (const f of ffs) {

		for (const ut of uts) {
                const t = ut.type.toLowerCase();

                if (!new RegExp(`${t}`).test(f)) continue;

                ut.file = require(f).default;

                if (ut.file?.logger && !LGR) LGR = ut.file.logger;

                out[t].push(ut);
            }
        }

        return out;
    }
    // loop over all the uts filtered
    else {
        for (const f of ffs) {
            const ut = require(f).default;

            const t = ut.type.toLowerCase();

            const matches = f.match(/([a-zA-Z0-9]+)\/unit-test\/[rest|ws]+\/[a-zA-Z0-9-_]+\.js/);

            if (!matches) continue;

            ut.service = matches[1];

            ut.file = f;

            if (ut.file?.logger && !LGR) LGR = ut.file.logger;

            out[t].push(ut);
        }
    }

    return out;
}

const REQ_DUMMY = {
	method: 'GET',
	get(key) {
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

function getAdm(logger) {
	const req = new EezzeRequest({
		...REQ_DUMMY,
		body: {},
	}, {}, logger);
	const adm = new ADM(req, logger);

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
	// await new Promise((resolve, reject) => {
	//     setTimeout(() => resolve(), 1000);
	// });

	let utsInt = [], host = '', port = 0, prId = 0;

	try {
		for (let a of process.argv) {
			const utslMatches = a.match(/^uts=(.*?)$/);
			const hostMatches = a.match(/^host=(.*?)$/);
			const portMatches = a.match(/^port=(.*?)$/);
			const projectMatches = a.match(/^prId=(.*?)$/);

			if (utslMatches) {
				for (const ut of utslMatches[1].split(',')) {
					const bits = ut.split('.');

					if (bits.length < 4) continue;

					utsInt.push({
						id: ut,
						sg: bits[0],
						type: bits[1],
						service: bits[2],
						ut: bits[3],
					});
				}
			}
			else if (hostMatches) {
				host = hostMatches[1];
			}
			else if (portMatches) {
				port = portMatches[1];
			}
			else if (projectMatches) {
				prId = projectMatches[1];
			}
		}

		if (!process.env.PROJECT_LOGGER_URL) {
			throw `"PROJECT_LOGGER_URL" was not set`;
		}

		if (!process.env.PROJECT_LOGGER_PORT) {
			throw `"PROJECT_LOGGER_PORT" was not set`;
		}

		console.log('\n\n[PROCESS]: Logger params: ', {
			host: host,
			port: port,
			path: '/v1',
			projectId: prId,
		});

		const lgr = new Logger('unit_tester', () => ({
			host: host,
			port: port,
			path: '/v1',
			projectId: prId,
		}));

		const uts = getUnitTests(utsInt);

		const toTmr = setTimeout(() => {
			setTimeout(() => process.exit(), 1000);

			lgr.error(
				{
					id,
					operationId: opId,
					data: {
						message: 'Unit testing timed out',
					},
				}, 
				{ _srcId: 'unit-test-exec', operationId: opId, id },
				getAdm(),
				[ 'error' ],
			);
		}, 6000);

		// // process all rest UT's fist
		for (const rut of uts.rest) {
			await RestUnitTest.run({
				logger: lgr,
				id: rut.id,
				opId: rut.service,
				url: rut.file.url,
				path: rut.file.path,
				method: rut.file.method,
				headers: rut.file.headers,
				urlParams: rut.file.urlParams,
				requestBody: rut.file.requestBody,
				adm: getAdm(),
			});
		}

		// process all the websocket UT's
		// for (const rut of uts.rest) {
			// await WsUnitTest.run({
				// logger: lgr,
				// id: rut.id,
				// opId: rut.service,
				// url: rut.file.url,
				// path: rut.file.path,
				// method: rut.file.method,
				// headers: rut.file.headers,
				// urlParams: rut.file.urlParams,
				// requestBody: rut.file.requestBody,
				// adm: getAdm(),
			// });
		// }

		// clearTimeout(toTmr);

		setTimeout(() => process.exit(0), 500);	
	}
	catch (err) {
		console.log(`There was an error processing your unit tests`, err);
	}

})();