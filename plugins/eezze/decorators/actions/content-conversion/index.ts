import ActionDataManager from '../../../classes/ActionDataManager';
import { addActionToQueue } from '../ActionDecorators';
import LogicChain from '../../../classes/logic/LogicChain';
import FileConversion from '../../../classes/FileConversion';


interface BaseConvertContentI {
    content: (adm: ActionDataManager, lc?: LogicChain) => any;
    output?: (adm: ActionDataManager, lc?: LogicChain) => any;
    onSuccess?: (adm: ActionDataManager, lc?: LogicChain) => void;
}

interface Base64OutputType extends BaseConvertContentI {}

export function Base64Converter (params: Base64OutputType) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function Base64Converter_OR (adm: ActionDataManager) {
            adm.setAction('Base64Converter_OR: ' + adm.totalActions);

            try {
                const file = await FileConversion.base64Decode(
                    await params.content(adm, new LogicChain(adm, this.loggger)),
                );

                adm.previousStepSuccessful = true;
                adm.setSuccess('Base64 content was successfully converted');

                adm.setResultInternal(file, 'Base64Converter->try');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }
            }
            catch (e) {
                adm.previousStepSuccessful = false;
                adm.setError('Base64 content conversion was unsuccessful');
            }
        }

        addActionToQueue(target, cb, 'Base64Converter', params);
    };
}