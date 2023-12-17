import { String } from '../../decorators/models/types';
import BaseModel from './BaseModel';

const bcrypt = require('bcrypt');
const saltRounds = 10;

interface REGISTER_LOGIN_PARAMS {
    email: string;
    password?: string;
    salt?: string;
    verifier?: string;
}

export default class BaseAuthenticationModel extends BaseModel {
    @String({ isSecret: true })
    protected salt;

    @String({ isSecret: true })
    protected verifier;

    constructor(params: REGISTER_LOGIN_PARAMS) {
        super();

        // console.log('\nBaseAuthenticationModel:constructor->params: ', params, '\n');

        // this is the login case
        if (params.salt && params.verifier) {
            this.salt = params.salt;
            this.verifier = params.verifier;
        }
        // this should be the register case
        else if (params.password) {
            this.salt = bcrypt.genSaltSync(saltRounds);
            this.verifier = bcrypt.hashSync(params.password, this.salt);
        }
    }

    generateVerificationPair(password: string) {
        const salt = bcrypt.genSaltSync(saltRounds);
        return {
            salt,
            verifier: bcrypt.hashSync(password, salt),
        }
    }

    login(password: string) {
        if (!password) {
            throw new Error('Password must be valid to login');
        }

        if (!this.verifier) {
            throw new Error('Please retrieve a user from the database before checking password');
        }

        return bcrypt.compareSync(password, this.verifier);
    }

    resetPassword(password: string) {
        const pair = this.generateVerificationPair(password);

        this.salt = pair.salt;
        this.verifier = pair.verifier;
    }
}