import DateMethods from './Date';
import { getRandomInt } from './NumberMethods';
import { generateRandomString } from './StringMethods';

export function checkEnvVars(key: string | string[]) {
	if (typeof key == 'string') {
		return typeof process.env[key] != 'undefined';
	}

	let k;

	const unsetVars = [];

	for (k in key)
	{
		const type = typeof process.env[k];

		if (type in ['undefined', 'null'])
		{
			unsetVars.push(k);
		}
	}

	return unsetVars;
}

function getRandomObject() {
	return {
		[generateRandomString(5)]: getDatatypeDefault('text'),
		[generateRandomString(5)]: getDatatypeDefault('number'),
		[generateRandomString(5)]: false,
		[generateRandomString(5)]: getDatatypeDefault('date'),
		[generateRandomString(5)]: {
			[generateRandomString(5)]: getDatatypeDefault('text'),
			[generateRandomString(5)]: getDatatypeDefault('text'),
			[generateRandomString(5)]: getDatatypeDefault('text'),
			[generateRandomString(5)]: getDatatypeDefault('text'),
		},
	}
}

export function getDatatypeDefault(type: string): any {
	switch (type) {
		case 'text': return generateRandomString(10);
		case 'number': return getRandomInt(1, 500);
		case 'boolean': return true;
		case 'date': return DateMethods.formatDate(new Date(), 'yyyy-MM-dd');
		case 'object': {
			const out: any = {};

			out[`${generateRandomString(5)}`] = getDatatypeDefault('text');
			out[`${generateRandomString(5)}`] = getDatatypeDefault('number');
			out[`${generateRandomString(5)}`] = getDatatypeDefault('boolean');
			out[`${generateRandomString(5)}`] = getDatatypeDefault('date');
			out[`${generateRandomString(5)}`] = getRandomObject();
			out[`${generateRandomString(5)}`] = [
				getRandomObject(),
				getRandomObject(),
				getRandomObject(),
				getRandomObject(),
			];

			return out;
		}
		case 'list': return [
			getDatatypeDefault('object'),
			getDatatypeDefault('object'),
			getDatatypeDefault('object'),
			getDatatypeDefault('object'),
		];
	}
}