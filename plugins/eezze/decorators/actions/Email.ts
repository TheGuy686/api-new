import { ActionDataManager, LogicChain } from '../../classes';
import { addActionToQueue } from '..';
import EmailTemplate from '../../classes/EmailTemplate';
import PDC from '../../classes/ProjectDependancyCaches';
import { kebabCase } from '../../libs/StringMethods';
import entityDefaults from '../../consts/entity-defaults';

const defaultKeys: any = entityDefaults.defaultKeys;

const he = require('he');

interface SMTPConfigI {
    datasource: string;
    from: E_CM_CB_STR | string;
    fromFirstName: E_CM_CB_STR | string;
    fromLastName: E_CM_CB_STR | string;
    to: E_CM_CB_STR_ARR | string | string[];
    subject: E_CM_CB_STR | string;
    template?: E_CM_CB_STR | string;
    templateVars?: E_CM_CB_OBJ;
    message?: E_CM_CB_STR | string;
    html?: E_CM_CB_STR | string;
    output?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
}

export function SendSMTPEmail (args: SMTPConfigI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function SendSMTPEmail_OR (adm: ActionDataManager) {
            adm.setAction('SendSMTPEmail_OR: ' + adm.totalActions);

            let to: string[],
                from: string,
                fromFirstName: string,
                fromLastName: string;

            const ds = PDC.getCachedDs(kebabCase(args.datasource));
            const repo = PDC.getRepo(`${ds.metadata.baseType}.${defaultKeys?.[ds.metadata.baseType]}`);

            if (typeof args.to == 'function') {
                to = await args.to(adm, new LogicChain(adm, this.logger));
            }
            else {
                if (typeof args.to == 'string') {
                    to = args.to.split('.');
                }
                else to = args.to;
            }

            if (typeof args.from == 'function') {
                from = await args.from(adm, new LogicChain(adm, this.logger));
            }
            else from = args.from;

            if (typeof args.fromFirstName == 'function') {
                fromFirstName = await args.fromFirstName(adm, new LogicChain(adm, this.logger));
            }
            else fromFirstName = args.fromFirstName;

            if (typeof args.fromLastName == 'function') {
                fromLastName = await args.fromLastName(adm, new LogicChain(adm, this.logger));
            }
            else fromLastName = args.fromLastName;

            const message: any = {
                envelope: {
                    from: `${fromFirstName} ${fromLastName} <${ from }>`,
                    to: to.join(', '),
                },
            };

            if (typeof args.subject == 'function') {
                message.subject = await args.subject(adm, new LogicChain(adm, this.logger));
            }
            else message.subject = args.subject;

            // fist if the template is set then we need to set both the markdown and the plain content to the tempalte output
            if (args?.template) {
                let tpl;

                if (typeof args.template == 'function') {
                    tpl = await args?.template(adm, new LogicChain(adm, this.logger));
                }
                else tpl = args.template;

                message.markdown = await EmailTemplate.render(
                    tpl,
                    await args?.templateVars(adm, new LogicChain(adm, this.logger))
                );

                message.plain = message.markdown;
            }
            else if (args?.message) {
                if (typeof args.message == 'function') {
                    message.text = await args.message(adm, new LogicChain(adm, this.logger));
                }
                else message.text = args.message;
            }
            else if (args?.html) {
                if (typeof args.html == 'function') {
                    message.html = he.decode(await args.html(adm, new LogicChain(adm, this.logger)));
                }
                else message.html = he.decode(args.message);
            }
            else {
                throw `SendSMTPEmail error: There was no valid email content given. Expected one of the following "template, message or html"`;
            }

            try {
                await repo.sendMail(message);

                adm.previousStepSuccessful = true;
                adm.setSuccess('Mail send was successful');

                if (typeof args.output == 'function') {
                    adm.setResultInternal(await args.output(adm, new LogicChain(adm, this.logger)));
                }
                else adm.setResultInternal({}, 'SendSMTPEmail');

                if (typeof args?.onSuccess == 'function') {
                    await args?.onSuccess(adm, new LogicChain(adm, this.logger));
                }
            }
            catch (e) {
console.log('Send smtp email Error: ', e);
                const em = `Email sending was unsuccessful. ${e.messaage || e}`;
                adm.previousStepSuccessful = false;
                adm.setError(em);
                throw em;
            }
        };

        addActionToQueue(target, cb, 'SendSMTPEmail', args);
    }
}