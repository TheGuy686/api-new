import EezzeTpl from './EezzeTpl';

export default class EmailTemplate {
    static async render(templateName: string, templateVars: any = {}) {
        try {
            return await EezzeTpl.render({
                prettify: false,
                templateType: 'email-templates',
                template: templateName,
                templateVars,
            });
        }
        catch (e) {
            console.log('ERROR PARSING EMAIL TEMPLATE: ', e.message);
            throw new Error(`There was an error rendering email template: ${templateName}`)
        }
    }
}