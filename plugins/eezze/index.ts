import Logger from './classes/Logger';

let mainLogger: Logger;

export function setLogger (logger: Logger) {mainLogger = logger}
export function getLogger () {return mainLogger}