import EezzeRequest from '../classes/EezzeRequest';
import EezzeWsRequest from '../classes/EezzeWsRequest';

interface RequestResponseI {
    success: boolean;
    status: number;
    body?: any;
    [key: string]: any;
}

export class RequestResponse {
    constructor(actionResponse: any = {}) {
        let res: any;

        if (typeof actionResponse.serialize == 'function') {
            res = actionResponse?.serialize();
        }
        else if (typeof actionResponse == 'object') {
            res = actionResponse;
        }
        else res = {};

        // this is only here till we have a better way of moving information
        // between the action events and then in one format back to here
        if (res?.body?.body) res.body = res.body.body;

        return {
            success: res?.success ?? false,
            status: res?.statusCode ?? 500,
            ...res?.body ?? {}
        } as RequestResponseI;
    }
}

export class SuccessResponse {
    constructor(body: any = null) {
        return {
            success: true,
            status: 200,
            ...body ?? {}
        };
    }
}

export class BadRequestResponse {
    constructor(body: Object = null) {
        return {
            success: false,
            status: 400,
            ...body ?? {}
        };
    }
}

export class ErrorResponse {
    constructor(er: EezzeRequest, body: Object = null) {
        return {
            success: false,
            status: 400,
            ...body ?? {}
        };
    }
}

export class InternalErrorResponse {
    constructor(er: EezzeRequest, body: Object = null) {
        return {
            success: false,
            status: 500,
            ...body ?? {}
        };
    }
}