import { EAction, Run, SendSMTPEmail } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction()
export default class SendMailAction extends BaseAction {
    @SendSMTPEmail({
        datasource: 'LocalSmtpService',
        from: (adm: ActionDataManager) => adm.input.from,
        to: (adm: ActionDataManager) => adm.input.to,
        fromFirstName: (adm: ActionDataManager) => adm.input.fromFirstName,
        fromLastName: (adm: ActionDataManager) => adm.input.fromLastName,
        subject: (adm: ActionDataManager) => adm.input.subject ?? 'There was no subject supplied',
        template: (adm: ActionDataManager) => adm.input.template,
        // @Ryan - There is a bug here somewhere with the rendering of the template Vars from json as its
        //         a string here for some reason
        templateVars: (adm: ActionDataManager) => JSON.parse(adm.input.templateVars),
    })
    async _exec() {}
}