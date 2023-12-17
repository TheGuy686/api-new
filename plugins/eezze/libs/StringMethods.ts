const Pluralize = require('pluralize');
import * as yaml from 'js-yaml';

/**
 * Filters any character not in this set:  a-zA-Z0-9 ,. 
 * @param str 
 * @returns 
 */
export function filterString(str: string): string {
	return str.replace(/[^a-zA-Z0-9 ,.]/g, '');
}

export function ucFirst(str: string) : string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function singularize(str: string) { return Pluralize.singular(str) }

export function pluralize(str: string) { return Pluralize(str) }

export function lcFirst(str: string) : string {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

export function generateRandomString(length: number = 10) : string {
	let text     = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++)
	{
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

export function convertStrToKey(str: string) : string {
	return String(str.replace(/[^0-9a-z]/gi, '').replace(/ /gi, ' ').toLowerCase());
}

export function randColor() : string {
	const clr = '#' + Math.floor(Math.random()*16777215).toString(16);

	if (clr.toLowerCase() == '#fff' || clr.toLowerCase() == '#ffffff')
	{
		return randColor();
	}

	return clr;
}

export function space(x: number) {
	let res = '';
	while (x--) {
		res += ' ';
	}
	return res;
}

export function getUniqueId() {
	const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	return s4() + s4() + '-' + s4();
};

export function convertToCapitalCase(inputString: string) {
    // Use a regular expression to split the input string
    // into words based on camel case or spaces
    let words = inputString.split(/(?=[A-Z])|\s+/);

    // Capitalize the first letter of each word and join them with spaces
    let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
}

export function kebabCase(str: string) {
	str = (str ?? '').replace(/\W+/g, ' ')
	  .replace(/_/g, ' ')
	  .split(/ |\B(?=[A-Z])/)
	  .map(word => word.toLowerCase())
	  .join(' ');

	return str.replace(/ /g, '-');
}

export function underscoreCase(str: string) {
	str = (str ?? '').replace(/\W+/g, ' ')
	  .replace(/_/g, ' ')
	  .split(/ |\B(?=[A-Z])/)
	  .map(word => word.toLowerCase())
	  .join(' ');

	return str.replace(/ /g, '_');
}

export function pascalCase(str: string) {
	const words = (str ?? '').replace(/\W+/g, ' ')
	  .replace(/_/g, ' ')
	  .split(/ |\B(?=[A-Z])/)
	  .map((word: string, index: number) => index == 0 ? word.toLowerCase() : ucFirst(word))
	  .join('');

	return ucFirst(words);
}

export function pascalCaseWithSpaces(str: string) {
	const words = (str ?? '').replace(/\W+/g, ' ')
	  .replace(/_/g, ' ')
	  .split(/ |\B(?=[A-Z])/)
	  .map((word: string, index: number) => index == 0 ? word.toLowerCase() : ucFirst(word))
	  .join(' ');

	return ucFirst(words);
}

export function camelCase(str: string) {
	const words = (str ?? '').replace(/\W+/g, ' ')
	  .replace(/_/g, ' ')
	  .split(/ |\B(?=[A-Z])/)
	  .map((word: string, index: number) => index == 0 ? word.toLowerCase() : ucFirst(word))
	  .join('');

	return lcFirst(words);
}

export function camelCaseWithSpaces(str: string) {
	const words = (str ?? '').replace(/\W+/g, ' ')
	  .replace(/_/g, ' ')
	  .split(/ |\B(?=[A-Z])/)
	  .map((word: string, index: number) => index == 0 ? word.toLowerCase() : ucFirst(word))
	  .join(' ');

	return lcFirst(words);
}

export function convertToStrToCode (str: string) {
	const tmp = str.split(' ');

	if (tmp.length < 3) {
		return str.substring(0, 3).toUpperCase();
	}

	let word,
		out = '';

	const skips = ['is', 'it', 'the', 'of', 'a', 'and', 'as', 'not'];

	for (word of tmp) {
		if (skips.indexOf(word) >= 0) continue;

		const matches = word.match(/^[a-zA-Z0-9]{1}/);

		out += matches[0];
	}

	return out.toUpperCase();
};

export function getStringCases(str: string) {
	str = str.replace(/\W+/g, ' ')
		.replace(/_/g, ' ')
		.split(/ |\B(?=[A-Z])/)
		.map(word => word.toLowerCase())
		.join(' ');

	const singular = singularize(str);
	const plural   = pluralize(str);

	const cases: any = {
		code: convertToStrToCode(str.replace(/ /g, '')).toLowerCase(),
		snakeCase: str.replace(/ /g, '-'),
		singleWord: str.replace(/ /g, ''),
		pascalCase: '',
		camelCase: '',
		underscoreCase: str.replace(/ /g, '_'),
		kebabCase: str.replace(/ /g, '-'),
		mysqlKey: str.replace(/\:/g, ' ').replace(/ /g, '_'),
		singular: {
			singular,
			underscore: singular.replace(/ /g, '_'),
			pascalCase: '',
			camelCase: '',
		},
		plural: {
			plural,
			underscore: plural.replace(/ /g, '_'),
			pascalCase: '',
			camelCase: '',
		},
	};

	str.split(' ').forEach(
		(word) =>
		{
			// this appends the next word with a capital
			if (cases.camelCase != '') {
				cases.camelCase += ucFirst(word);
			}
			// here we append the first word as a lowercase
			else {
				cases.camelCase += word;
			}

			cases.pascalCase += ucFirst(word);
		}
	);

	singular.split(' ').forEach(
		(word: string) => {
			// this appends the next word with a capital
			if (cases.singular.camelCase != '')
			{
				cases.singular.camelCase += ucFirst(word);
			}
			// here we append the first word as a lowercase
			else {
				cases.singular.camelCase += word;
			}

			cases.singular.pascalCase += ucFirst(word);
		}
	);

	plural.split(' ').forEach(
		(word: string) => {
			// this appends the next word with a capital
			if (cases.plural.camelCase != '') {
				cases.plural.camelCase += ucFirst(word);
			}
			// here we append the first word as a lowercase
			else {
				cases.plural.camelCase += word;
			}

			cases.plural.pascalCase += ucFirst(word);
		}
	);

	cases.singular.mysqlKey = singular.replace(/\:/g, ' ').replace(/ /g, '_');
	cases.plural.mysqlKey   = plural.replace(/\:/g, ' ').replace(/ /g, '_');

	return cases;
}

export function randDarkColor () {
    const lum = -0.25;
    let hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}

/**
 * Convert a JSON object to a YAML formatted string
 * 
 * @param input JSON object
 * @returns yaml formatted string
 */
export function jsonToYaml(input: any): string {
	return yaml.dump(input);
}

/**
 * Converts single line ssh keys back to the proper formatting
 * 
 * @param sshKey sshKey string
 * @returns 
 */
export function formatSSHKey(sshKey: string): string {
    let header: string;
    let footer: string;

    // Determine the type of key and set appropriate headers and footers
    if (sshKey.includes('OPENSSH')) {
        header = '-----BEGIN OPENSSH PRIVATE KEY-----';
        footer = '-----END OPENSSH PRIVATE KEY-----';
    } else { // Default to RSA if not specified
        header = '-----BEGIN RSA PRIVATE KEY-----';
        footer = '-----END RSA PRIVATE KEY-----';
    }

    // Remove the existing headers, footers, and newlines
    const base64Key = sshKey.replace(header, '')
                            .replace(footer, '')
                            .replace(/\s+/g, '');
    
    // Split the key into 64 character chunks
    const match = base64Key.match(/.{1,64}/g);
    const formattedKey = match ? match.join('\n') : base64Key;
    
    return `${header}\n${formattedKey}\n${footer}`;
}