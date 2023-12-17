import { generateRandomString } from '../libs/StringMethods';

const toMilliseconds = require('to-milliseconds').convert;

interface SucessErrorResultI {
    success: boolean;
    headers?: any;
    error?: string;
    decoded?: any;
    token?: string;
}

// https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
// this page is for reference to the various options that can be set in the jwt token
export interface ExpiresInI {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}

const crypto = require('crypto'),
      SHA256 = require('crypto-js/sha256');

export default class EezzeJwtToken {
    // private static secret: string = 'this-is-a-long-string-that-should-be-replaced';

    private static getTokenId(secret: string) {
        return SHA256(`${generateRandomString(10)}-${SHA256(secret)}-${generateRandomString(10)}`).toString();
    }

    private static toBase64(input: any) {
        const str = typeof input == 'object' ? JSON.stringify(input) : input;
        return Buffer.from(str).toString ('base64');
    }

    private static replaceSpecialChars (b64string: string) {
        // create a regex to match any of the characters =,+ or / and replace them with their // substitutes
        return b64string.replace (/[=+/]/g, charToBeReplaced => {
            switch (charToBeReplaced) {
                case '=': return '';
                case '+': return '-';
                case '/': return '_';
            }
        });
    }

    private static signHeaderValue(value: string | number, secret: string) {
        // return `${value}-${secret}`;
        return SHA256(`${value}-${secret}`).toString();
    }

    private static generateHeaderSignature(
        signature: string,
        additionalHeaders: {[key: string]: string} = {},
        secret: string,
        debug: boolean = false,
    ) {
        const headers: {[key: string]: any} = {
            sig: signature,
            alg: 'HS256',
            typ: 'JWT',
        };

        if (Object.keys(additionalHeaders).length > 0) {
            for (const k in additionalHeaders) {
                headers[k] = this.signHeaderValue(additionalHeaders[k], secret);
            }
        }

        if (debug) {
            console.log('Headers: ', headers);
            console.log('Additional Headers: ', additionalHeaders);
        }

        return this.replaceSpecialChars(this.toBase64(headers));
    }

    private static generatePayloadSignature(signature: string, payload: any, expiresIn: ExpiresInI = {}, debug: boolean = false,) {
        const payl: any = {};

        payl.payload = payload;

        payl.signature = signature;

        // @Ryan - Fix this. the host should not be coming from the .env file
        payl.iss = `${process.env.DEFAULT_HTTP_PROTOCOL}${process.env.DEFAULT_SERVER_HOST}${process.env.DEFAULT_WS_SERVER_PORT ? `:${process.env.DEFAULT_WS_SERVER_PORT}` : process.env.DEFAULT_WS_SERVER_PORT}`
        payl.iat = Date.now();

        if (Object.keys(expiresIn).length > 0) {
            const expInMs = toMilliseconds({...expiresIn});
            // payl['exp'] = toMilliseconds({...expiresIn});
            payl.exp = payl.iat + expInMs;
            payl.expAt = payl.iat + expInMs;
        }

        const token = this.replaceSpecialChars(this.toBase64(payl));

        if (debug) {
            console.log('Debug payload: ', payload);
            console.log('Debug "payload signature": ', token);
        }

        return token;
    }

    public static getToken(
        payload: any,
        expiresIn: ExpiresInI = {minutes: 15},
        additionalHeaders: {[key: string]: string} = {},
        secret: string,
        debug: boolean = false,
    ) {
        return this.sign(payload, expiresIn, '', { ...additionalHeaders }, debug, secret).token;
    }

    private static getIdToken(
        payload: any,
        expiresIn: ExpiresInI = {minutes: 15},
        additionalHeaders: {[key: string]: string} = {},
        secret: string,
        debug: boolean = false,
    ) {
        return this.sign(
            payload,
            expiresIn,
            '',
            {...additionalHeaders, type: 'id-token'},
            debug,
            secret,
        ).token;
    }

    private static getRefreshToken(
        idTokenSignature: string,
        payload: any,
        expiresIn: ExpiresInI = {minutes: 15},
        additionalHeaders: {[key: string]: string} = {},
        secret: string,
        debug: boolean = false,
    ) {
        return this.sign(
            payload,
            expiresIn,
            idTokenSignature,
            {...additionalHeaders, type: 'refresh-token'},
            debug,
            secret,
        ).token;
    }

    private static generateSignature(jwtB64Header: string, jwtB64Payload: string, secret: string) {
        let signature: any = crypto.createHmac('sha256', secret);

        signature.update(`${jwtB64Header}.${jwtB64Payload}`);
        signature = signature.digest('base64');

        return this.replaceSpecialChars(signature);
    }

    private static checkHeaders(
        headers: any,
        additionalHeaders: {[key: string]: string},
        secret: string,
    ) : string[] {
        const out: string[] = [];

        if (Object.keys(additionalHeaders).length == 0) return out;

        for (const k in additionalHeaders) {
            if (typeof headers[k] == 'undefined') {
                out.push(`${k} didn't exist in the headers`);
                continue;
            }
            if (headers[k] != this.signHeaderValue(additionalHeaders[k], secret)) {
                out.push(`"${k}" value didn't match up. Expected: ${additionalHeaders[k]}`);
            }
        }

        return out;
    }

    static verify(
        token: string,
        message?: string,
        additionalHeaders: {[key: string]: string} = {},
        secret: string = 'this-is-a-long-string-that-should-be-replaced',
        debug: boolean = false,
    ) : SucessErrorResultI {
        try {
            if (typeof token == 'undefined' || token == 'undefined') {
                throw new Error(`Given JWT token was invalid. Given: ${token}`);
            }

            const signedRequest = (token + '').split('.');

            const headers: any = JSON.parse(Buffer.from(signedRequest[0], 'base64').toString('ascii'));
            const payload: any = JSON.parse(Buffer.from(signedRequest[1], 'base64').toString('ascii'));
            const signature: string = signedRequest[2];

            const expectedSignature = this.generateSignature(signedRequest[0], signedRequest[1], secret);
            const check: string[] = this.checkHeaders(headers, additionalHeaders, secret);

            if (check.length > 0) {
                console.log('Token headers check errrors: ', check);

                return {
                    success: false,
                    error: message ?? 'Token is invalid',
                }
            }

            // Confirm the signature
            if (signature !== expectedSignature) {
                console.error('Cannot validate signed request: invalid request signature');
                return {
                    success: false,
                    error: message ?? 'Token is invalid',
                }
            }

            if (debug) {
                console.log('Headers: ', headers);
                console.log('Payload: ', payload);
            }

            // check if expired
            if (typeof payload?.expAt != 'undefined') {
                if (Date.now() >= payload?.expAt) {
                    if (debug) {
                        console.log(`\nToken has expired\n`);
                    }

                    return {
                        success: false,
                        error: message ?? `JWT Token has already expired`,
                    };
                }
            }

            return { success: true, decoded: payload };
        }
        catch (e) {
            // console.log('EezzeJWTToken->verify - Error: ', e?.message ?? e);

            return {
                success: false,
                error: message ?? `JWT Token validation error: ${e.message}`
            };
        }
    }

    static getLoginTokens(
        payload: any,
        expiresIn: ExpiresInI = {minutes: 15},
        refreshTokenExpiresIn: ExpiresInI = {days: 7},
        additionalHeaders: {[key: string]: string} = {},
        secret: string,
    ) {
        return {
            idToken: this.getIdToken(payload, expiresIn, additionalHeaders, secret),
            refreshToken: this.getRefreshToken(
                payload?.signature,
                payload,
                refreshTokenExpiresIn,
                additionalHeaders,
                secret,
            ),
        };
    }

    static resign(
        payload: any,
        expiresIn: ExpiresInI = {minutes: 15},
        refreshTokenExpiresIn: ExpiresInI = {days: 7},
        additionalHeaders: {[key: string]: string} = {},
        secret: string,
        debug: boolean = false,
    ) {
        return {
            idToken: this.getIdToken(payload, expiresIn, additionalHeaders, secret, debug),
            refreshToken: this.getRefreshToken(
                payload?.signature,
                payload,
                refreshTokenExpiresIn,
                additionalHeaders,
                secret,
                debug,
            ),
        };
    }

    static sign(
        payload: any,
        expires: ExpiresInI = {},
        previousSignature: string = '',
        additionalHeaders: {[key: string]: string} = {},
        debug: boolean = false,
        secret: string = 'this-is-a-long-string-that-should-be-replaced',
    ) : SucessErrorResultI {
        const tokenSig = this.getTokenId(secret) + (previousSignature != '' ? SHA256(previousSignature) : '');
        const jwtB64Header : string = this.generateHeaderSignature(tokenSig, additionalHeaders, secret, debug);
        const jwtB64Payload : string = this.generatePayloadSignature(tokenSig, payload, expires, debug);
        const signature: string = this.generateSignature(jwtB64Header, jwtB64Payload, secret);

        return {
            success: true,
            token: `${jwtB64Header}.${jwtB64Payload}.${signature}`,
        };
    }
}