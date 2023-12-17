import { EDataSource } from "@eezze/decorators";

@EDataSource({
    datasourceType: 'SmtpMailService',
    port: process.env.EMAIL_SERVICE_PORT,
    host: process.env.EMAIL_SERVICE_HOST,
    user: process.env.EMAIL_SERVICE_USER,
    password: process.env.EMAIL_SERVICE_PASSWORD,
})
export default class LocalSmtpService {}