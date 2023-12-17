import { serializeUrl } from '../../libs/HttpMethods';
import { Logger } from '../../classes';

export default class RestIntegration {
    private logger: Logger;
    private host: string;

    constructor(logger: Logger, host: string) {
        this.logger = logger;

        let url = serializeUrl(host, '', {}) as string;

        if (!/^[a-zA-Z]{2,10}:\/\//.test(url)) {
            url = `http://${url}`;
        }

        this.host = url;
    }
}