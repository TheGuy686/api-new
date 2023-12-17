import { ActionDataManager, LogicChain } from '../../../classes';
import { addActionToQueue } from '../ActionDecorators';
import Normalizer from '../../../classes/ai/normalizer';
import EezzeClassifyI from '../../../interfaces/EezzeAiI';

export function EezzeClassify (params: EezzeClassifyI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function RenderTemplate_OR (adm: ActionDataManager) {
            try {
                let inp: string;

                if (typeof params.input == 'function') {
                    inp = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params.input == 'string') {
                    inp = params.input;
                }

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(
                        adm,
                        new LogicChain(adm, this.logger),
                        prompt
                    );
                }

                let res = Normalizer.run(inp);

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(res, 'CreateOne');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`CreateOne "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'CreateOne');
                                return;
                            }
                        }
                        else {
                            if (await cond.condition(adm, new LogicChain(adm, this.logger))) {
                                let msg = '';

                                if (typeof cond.message == 'function') {
                                    msg = await cond.message(adm, new LogicChain(adm, this.logger));
                                }
                                else msg = cond.message;

                                adm.previousStepSuccessful = false;
                                adm.setResultInternal({}, 'CreateOne');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                let outputChanged = false;

                adm.previousStepSuccessful = true;

                if (typeof params?.output === 'function') {
                    outputChanged = true;
                    res = await params.output(adm, new LogicChain(adm, this.logger), res);
                }

                adm.setSuccess(`Successfully classified input`);
                adm.setResultInternal(res, 'EezzeClassify');

                if (typeof params?.onSuccess == 'function') {
                    outputChanged = true;
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }
            }
            catch (err) {
                adm.setError(`EezzeClassify Error: Could not classify input. Error: "${err.message ?? err}"`);
            }
        };

        addActionToQueue(target, cb, 'EezzeClassify', params);
    };
}