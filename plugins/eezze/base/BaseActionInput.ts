import RequestErrorMessagesI from '../interfaces/RequestErrorMessagesI';
import Logger from '../classes/Logger';
import { ActionDataManager, EezzeRequest } from '../classes';

export default class BaseActionInput {
	static propValidationCbs: {[key: string]: Function} = {};
	static propMapperCbs: {[key: string]: Function} = {};
	static _serializeKeyOverrides: {[key: string]: (value: any) => any} = {};
	static _serializeIgnoreKeys: string[] = [];
	static _propertyDecoratorArgs: {[key: string]: any} = {};

	logger: Logger;

	static _srcId: string = '_val';

	validate(adm: ActionDataManager) {return false}

	serialize(adm: ActionDataManager) : any {}
}