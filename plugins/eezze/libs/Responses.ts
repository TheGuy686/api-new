import EezzeRequest from '../classes/EezzeRequest';
import EezzeWsRequest from '../classes/EezzeWsRequest';

export class RestfulResponse {
    constructor(er: EezzeRequest, actionResponse: any = {}) {
        if (er?.response?.headersSent) return;

        let body = '';

        if (actionResponse?.error) {
            if (Array.isArray(actionResponse?.error) && actionResponse.error.length > 0) {
                body = actionResponse?.error;
            }
        }
        else if (actionResponse?.body) {
            body = actionResponse.body;
        }

        er?.response?.status(actionResponse?.statusCode ?? 200).send(body);
    }
}

export class SuccessResponse {
    constructor(er: EezzeRequest, body: any = null) {
        if (er?.response?.headersSent) return;

        if (!body) {
            return er.response.status(200).send(body);
        }

        er.response.status(200).send(body);
    }
}

export class BadRequestResponse {
    constructor(er: EezzeRequest, body: Object = null) {
        if (er?.response?.headersSent) return;

        if (!body) {
            return er.response.status(400).send(body);
        }

        er.response.status(400).send(body);
    }
}

export class ErrorResponse {
    constructor(er: EezzeRequest, body: Object = null) {
        if (er?.response?.headersSent) return;

        if (!body) {
            return er.response.status(400).send(body);
        }

        er.response.status(400).send(body);
    }
}

export class InternalErrorResponse {
    constructor(er: EezzeRequest, body: Object = null) {
        if (er?.response?.headersSent) return;

        if (!body) {
            return er.response.status(500).send(body);
        }

        er.response.status(500).send(body);
    }
}