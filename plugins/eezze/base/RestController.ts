import Logger from '../classes/Logger';
import { generateRandomString } from '../libs/StringMethods';

export default class BaseController {
    static logger: Logger;
    static group: string = 'not set';
    static _srcId: string = '_rest_cont';
    static mainClassName: string;

    static id: string = generateRandomString(5);
}