import ActionDecoratorArgs from '../../../interfaces/ActionDecoratorArgs';
import ActionDataManager from '../../../classes/ActionDataManager';
import { addActionToQueue } from '../../../decorators';
import LogicChain from '../../../classes/logic/LogicChain';

interface ResponseRedirectArgsI extends ActionDecoratorArgs {
    url: E_CM_CB_STR | string;
}

export function Redirect (params: ResponseRedirectArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value.bind(target);

        const cb = async function Redirect_OR (adm: ActionDataManager) {
            try {
                adm.setAction('Redirect_OR: ' + adm.totalActions);

                if (adm.request.constructor.name === 'EezzeRequest') {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(params.url, 'Redirect->if');

                    let url;

                    if (typeof params.url == 'function') {
                        url = await params.url(adm, new LogicChain(adm, this.logger));
                    }
                    else url = params.url;

                    this.logger.info('Decorators->Response->Redirect Success', 'Decorators->Response->Redirect Success', adm, [ 'info' ]);

                    (adm.request as any).response.redirect(url);
                }
                else {
                    adm.previousStepSuccessful = false;
                    adm.setError('Redirects are only available with REST type connections');
                    adm.setResultInternal(params.url, 'Redirect->else');
                    adm.setResponseCode(500);
                }
            }
            catch (e) {
                adm.previousStepSuccessful = false;
                adm.setError(`Data transformation error: "${e.message || e}"`);
            }
        };

        addActionToQueue(target, cb, 'Redirect', params);
    }
}