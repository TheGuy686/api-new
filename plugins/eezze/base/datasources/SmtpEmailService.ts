import { Logger } from '../../classes';

const markdown = require('nodemailer-markdown').markdown;

let mailer: any;

export default class SmtpEmailService {
    protected smtp: any;
    protected connected: boolean = false;
    protected connectIfNotConnected: Function;

    constructor(args: any, logger: Logger) {
        this.connectIfNotConnected = async () => {
            if (this.connected) return;

            if (!mailer) {
                mailer = require('nodemailer');
            }

            // const nodemailer = require('nodemailer');

            const smtpConfig = {
                host: args.host,
                port: args?.port ?? 465,
                secure: args.secure ?? true,
                auth: {
                    user: args.auth.user,
                    pass: args.auth.pass,
                },
            };

            this.smtp = mailer.createTransport(smtpConfig);

            this.smtp.use('compile', markdown());

            return await new Promise((resolve, reject) => {
                this.smtp.verify(async function(error: any, success: any) {
                    if (error) {
                        console.log('MAIL SEND ERROR: ', error);
                        return reject(`Couldn't connect to SMTP service. Please check your connection settings. Error: ${error.toString()}`);
                    }

                    console.log('Server is ready to take our messages');
                    resolve(1);
                });
            });
        }
    }

    async sendMail(message: any) {
        await this.connectIfNotConnected();

        return await this.smtp.sendMail(message);
    }
}