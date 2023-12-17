import RenderTemplateI from '../../../interfaces/RenderTemplateI';
import ETpl from '../../../classes/logic/render-templates';
import ActionDataManager from '../../../classes/ActionDataManager';
import { addActionToQueue } from '../ActionDecorators';

export * from './service';
export * from './migration';

export function RenderTemplate (params: RenderTemplateI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function RenderTemplate_OR (adm: ActionDataManager) {
            return await ETpl.render(adm, params, this.logger);
        };

        addActionToQueue(target, cb, 'RenderTemplate', params);
    };
}