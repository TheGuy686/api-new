import { ActionDataManager } from '../classes';

interface ArgsI {
    statusCode?: number;
    success?: boolean;
    error?: string;
    data?: any;
    body?: any;
    message?: any;
}

export default class ActionResponse {
    private statusCode?: number;
    private success: boolean = false;
    private data: any = {};
    private adm: ActionDataManager;

    constructor(args: ArgsI, adm: ActionDataManager) {
        this.adm = adm;

        if (args.success) {
            this.success = args.success;
        }

        if (!args.statusCode) {
            if (args.success) {
                this.statusCode = 200;
            }
            else {
                this.statusCode = 500;
            }
        }
        else {
            this.statusCode = args.statusCode;
        }

        if (args.error) {
            this.data.error = args.error;
        }

        if (args.data) {
            this.data.body = args.data;
        }

        if (args.body) {
            this.data.body = args.body;
        }

        if (args.message) {
            this.data.body = {
                message: args.message,
            };
        }
    }

    serialize() {
        return {
            statusCode: this.statusCode,
            success: this.success,
            body: {...this.data},
        };
    }
}