import RequestErrorMessagesI from '../interfaces/RequestErrorMessagesI';
import Logger from '../classes/Logger';
import { ActionDataManager as ADM, EezzeRequest, LogicChain } from '../classes';
import { E_AUTH_ITEM } from '../decorators';

export default class BaseAuthenticator {
	static _srcId: string = '_auth';

	static validationErrors: RequestErrorMessagesI = {};
	static propValidationCbs: {[key: string]: Function} = {};
	static propMapperCbs: {[key: string]: Function} = {};
	static _serializeKeyOverrides: {[key: string]: (value: any) => any} = {};
	static _serializeIgnoreKeys: string[] = [];
	static _propertyDecoratorArgs: {[key: string]: any} = {};

	request: EezzeRequest;
	logger: Logger;

	async getTokenFromSycForType(
		adm: ADM,
		type: E_AUTH_TYPE,
		source: E_AUTH_ITEM,
	): Promise<string | boolean> {
		let token: string;

		const c = source.condition;

		switch (type) {
			case 'jwt': {
				// here we process the condition if there is one supplied. This could be becase only
				// certain sources might be conditional and need more control.
				if (typeof c != 'undefined') {
					if (typeof c == 'function') {
						// don't even try to get the source if the condition is not met
						if (!await c(adm, new LogicChain(adm, adm.logger))) return false;
					}
					else if (typeof c == 'boolean' && !c) {
						return false;
					}
				}

				if (typeof source.src == 'function') {
					token = await source.src(adm, new LogicChain(adm, adm.logger));
				}
				else token = source.src;

				if (!(token != '' && token != 'undefined' && typeof token == 'string' && token.length > 0)) {
					return false;
				}

				return token.replace(/^[ ]?Bearer([ ]+|[ ]?)/, '');
			}
			default: {
				console.log('Undealt with authenticator type', type);

				return false;
			}
		}
	}

	validate(adm: ADM) {return false}

	serialize(adm: ADM, src: string) : any {}
}