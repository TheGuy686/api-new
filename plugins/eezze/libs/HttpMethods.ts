const urlencode = require('urlencode');

export function serializeUrl(host: string, path: string, params: any, returnAsObject: boolean = false) : object | string {
	if (arguments.length < 2) {
        console.error('serializeUrl needs a path and params arg. Please supply both arguments');
        process.exit();
    }

	let urlparams: string[] = [], k;

	for (k in params) urlparams.push(`${k}=${urlencode(params[k])}`);

	if (returnAsObject) {
		return {
			host,
			path,
			params: urlparams.join('&'),
		};
	}

	return `${host}${path}${urlparams.length > 0 ? `?${urlparams.join('&')}` : ''}`;
}