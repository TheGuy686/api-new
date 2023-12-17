import 'reflect-metadata';

console.clear();

require('module-alias/register');
require('dotenv-json')({ path: '.env.json' });
require('source-map-support').install();

import LogicChain from '../../plugins/eezze/classes/logic/LogicChain';
import Logger from '@eezze/classes/Logger';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import EezzeRequest from '@eezze/classes/EezzeRequest';
import RestState from '@eezze/classes/RestState';

const logger = new Logger('bl-exec-process');

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
	body: {
		age: 20,
		height: 177,
		weight: 70.5,
	},
};

function getAdm() {
	const req = new EezzeRequest({
		...REQ_DUMMY,
	}, {}, logger);
	const adm = new ActionDataManager(req, logger);

	adm.setState(new RestState());

	adm.setInput(req.requestBody);

	adm.request.auth.setUser({
		id: 1,
		email: 'ryanjcooke@hotmail.com',
		firstName: 'Ryan',
		lastName: 'Cooke',
		age: 36,
		date: '2023-20-31 12:12:00',
	});
	adm.request.auth.setUser('allkkdihlekjrieuhfksjdisdjkfisdfhklj');
	adm.request.auth.setRoles([ 'ROLE_USER', 'ROLE_ADMIN' ]);

	return adm;
}

(async () => {
	const adm = getAdm();
    const lc = new LogicChain(adm, logger);

    const res = (async () => {

		lc.assign.number('email', async (ilc: LogicChain) => {
			ilc.number.calc('10 * 15');

			return await ilc.result();
		});

        lc.number.custom(() => {
			return Number('0.23531');
		});

		// Action 1 - Logic item "0"
		lc.text.custom(() => {
			return 'This is just a string';
		});

		// Action 2 - Logic item "0"
		lc.void.custom(() => {
			//console.log('hello again ryan');
		});

		// Action 2 - Logic item "1"
		lc.number.calc('1 + 1');

        lc.number.calc('7*9${1}9*6', [
			adm.request.requestBody.age,
		]);

		// Action 2 - Logic item "2"
		lc.number.addition(1, 10);

		// Action 4 - Logic item "3"
		lc.void.custom(() => {
			for (let i = 0; i < 10; i++) {
				//console.log(`I "${i}" ; "${lc.prop('email')}"`);
			}
			// lc.list.forEach(async (element, lc: LogicChain) => {
			
			// 	lc.list.forEach(element, async (element, lc: LogicChain) => {
			// 		lc.number.assign('key', adm.request.method);
	
			// 	});
			// });
		});

		// Action 5 - Logic item "0"
		lc.text.format(
			'This is an example "${1}`" and here and there ${1}', 
			[
				adm.request.method,
			]
		);

		lc.log(`currently logging the value: `, () => lc.current);

		// Action 5 - Logic item "1"
		lc.date(adm.request.auth.user.date).format(`[ryan was here] YYYY / MM / DD hh:mm:ss`);

		// Action 5 - Logic item "2"
		lc.date(adm.request.auth.user.date).format(`[this is a date] "\${1}" [of the] \${2} [month]`, [
			`[${adm.request.method}]`,
			'Mo',
		]);

		// Action 5 - Logic item "13"
		lc.number.format(`\${1}\${2}0.2`, [20, 20]);

		// Action 5 - Logic item "14"
		lc.object({
			prop1: adm.request.method,
			prop3: {
				prop4: {
					prop6: adm.request.method,
				},
				prop7: {
					'prop-78': {
						prop7845: adm.request.fullUrl,
					},
				},
			},
		});

		// Action 6 - Logic item "15"
		lc.list([
			{
				name: 'ryan',
				lastName: 'cooke',
			}
		]).json();

		// Action 7 - Logic item "16"
		lc.list().oddNumList(-10, 10);

		lc.state.assign.text('ryan', () => Number('10.85').toString());

		const r = await lc.result();

		lc.history();

		return r;
	})();

    console.log('Res: ', await res, ' : ',  lc.prop('email'), ' : ', lc.state.prop('ryan'));
})();