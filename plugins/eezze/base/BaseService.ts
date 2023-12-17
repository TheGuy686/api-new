import Logger from '../classes/Logger';
import ESocket from '../classes/ESocket';
import { BaseAction } from './action';
import { BaseAuthenticator } from '.';
import { ActionDataManager, EezzeRequest } from '../classes';

export default class BaseService {
	protected logger: Logger;
	protected auth: BaseAuthenticator;
	protected sockets: {[k: string]: ESocket} = {};
	protected _srcId: string = '_ser';

	protected group: string;
	protected action: BaseAction;
	protected _request: ActionDataManager;

	public get request() : ActionDataManager {return this._request}
	public get authenticator () {return this.auth}

	constructor(args: any) {

	}
}