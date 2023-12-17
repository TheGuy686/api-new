import ActionDataManager from '../../classes/ActionDataManager';
import RenderTemplateI from '../../interfaces/RenderTemplateI';
import EezzeTpl from '../../classes/EezzeTpl';
import Logger from '../../classes/Logger';
import LogicChain from './LogicChain';
import { skipOn } from '../../decorators';

export default class ETpl {
    static async render(adm: ActionDataManager, params: RenderTemplateI, logger: Logger) {
        adm.setAction('RenderTemplate_OR: ' + adm.totalActions);

        if (typeof params?.skipOn != 'undefined' && await skipOn(params, adm)) {
            return;
        }

        if (typeof params?.prettify == 'undefined') params.prettify = false;

        try {
            let template: string;

            if (typeof params?.template == 'function') {
                template = await params.template(adm, new LogicChain(adm, logger));
            }
            else template = params?.template ?? '';

            let tv: any;

            if (typeof params?.templateVars == 'function') {
                tv = await params.templateVars(adm, new LogicChain(adm, logger));
            }
            else if (typeof tv == 'object') tv = params.templateVars;

            if (typeof params?.beforeExec == 'function') {
                await params.beforeExec(adm, new LogicChain(adm, logger), tv);
            }

            let res = await EezzeTpl.render({
                prettify: params?.prettify,
                prettifyMode: params?.prettifyMode,
                cache: params?.cache,
                template,
                templateVars: tv ?? {},
                linter: params?.linter,
                templates: params?.templates,
            });

            adm.previousStepSuccessful = true;
            adm.setSuccess(`Template "${params.template}" was successfully rendered`);
            adm.setResultInternal(res, 'RenderTemplate->render');

            if (typeof params?.output === 'function') {
                res = await params.output(adm, new LogicChain(adm, logger));
            }

            if (typeof params?.onSuccess == 'function') {
                await params?.onSuccess(adm, new LogicChain(adm, logger));
            }

            logger.info('Decorators->File Actions-> Success', 'Decorators->File Actions-> Success', adm, [ 'info' ]);

            return res;
        }
        catch (e) {
// console.log('ERROR: ', e);
            adm.previousStepSuccessful = false;
            adm.setError(`Template "${params.template}" rendering was unsuccessful`);
        }
    }
}