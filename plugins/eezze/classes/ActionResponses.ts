interface ArgsI {
    statusCode?: number;
    success?: boolean;
    error?: string;
    data?: any;
    body?: any;
}

export class SuccessResponses {
    constructor(body: any = {message: 'ok'}, statusCode: number = 200) {
        return {
            statusCode,
            success: true,
            body,
        };
    }
}

export class BadRequestResponse {
    constructor(message: string | object = 'Bad Request') {
        return {
            statusCode: 400,
            success: false,
            body: typeof message == 'string' ? { error: message } : message,
        };
    }
}

export class UnauthResponse {
    constructor(message: string | object = 'Unauth') {
        return {
            statusCode: 401,
            success: false,
            body: typeof message == 'string' ? {error: message} : message,
        };
    }
}

export class ForbiddenResponse {
    constructor(message: string | object = 'Forbidden') {
        return {
            statusCode: 403,
            success: false,
            body: typeof message == 'string' ? {error: message} : message,
        };
    }
}

export class InternalServerErrorResponse {
    constructor(message: string = 'Internal Server Error') {
        return {
            statusCode: 500,
            success: false,
            body: {error: message},
        };
    }
}