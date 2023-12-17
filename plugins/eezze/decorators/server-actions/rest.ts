import ProjectDependancyCaches from '../../classes/ProjectDependancyCaches';
import RestActionArgsI from '../../interfaces/RestActionArgsI';
import Request from '../../classes/Request';
import { addActionToQueue } from '..';
import { serializeUrl } from '../../libs/HttpMethods';
import ActionDataManager from '../../classes/ActionDataManager';
import LogicChain from '../../classes/logic/LogicChain';

export function RestAction (params: RestActionArgsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function ServiceCaller_OR (adm: ActionDataManager) {
            adm.setAction('ServiceCaller_OR: ' + adm.totalActions);

            let ds: any;

            if (params?.datasource && params.datasource != '') {
                ds = new (ProjectDependancyCaches.getCachedDs(params.datasource));
                ds = ds.ds.source;
            }

            let headers: any = {}, requestBody: any = {}, urlParams: any = {}, urlPath: any = '';

            if (typeof ds?.headers == 'function') {
                headers = {...headers, ...(await ds.headers(adm, new LogicChain(adm, this.logger)))};
            }
            else if (typeof ds?.headers == 'object') {
                headers = {...headers, ...ds.headers};
            }

            if (typeof params?.urlPath == 'function') {
                urlPath = `${await params.urlPath(adm, new LogicChain(adm, this.logger))}`;
            }
            else if (typeof params?.urlPath == 'string') {
                urlPath = `${params.urlPath}`;
            }

            if (typeof params?.requestBody == 'function') {
                requestBody = {...(await params.requestBody(adm, new LogicChain(adm, this.logger)))};
            }
            else if (typeof params?.requestBody == 'object') {
                requestBody = {...(params.requestBody as any)};
            }

            const url: string = serializeUrl(`${ds.host}${urlPath}`, '', urlParams) as string;

            try {
                const res = await Request[params.method](
                    url,
                    requestBody,
                    params?.showUploadFeedBackCb,
                    headers,
                    { logger: this.logger }
                ) as any;

                let obj = res.toObject()

                if (typeof params?.output === 'function') {
                    obj = await params.output(obj, adm, new LogicChain(adm, this.logger));
                }

                adm.previousStepSuccessful = true;
                adm.setResultInternal(obj, 'RestAction');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                return obj;
            }
            catch (e) {
                const em = `Server Action Decorators: RestAction: "${e.message || e}"`;

                this.logger.error(`RestAction error: ${e.message}`, 'Server Action Decorators: RestAction: catch', adm);

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb, 'RestAction', params);
    };
}