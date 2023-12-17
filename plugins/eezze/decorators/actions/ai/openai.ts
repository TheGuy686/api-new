import OpenAIPromptI from '../../../interfaces/OpenAiI';
import { ActionDataManager, LogicChain } from '../../../classes';
import { addActionToQueue } from '../ActionDecorators';

import OpenAI from 'openai';
import { skipOn } from '..';

export function PromptAI (params: OpenAIPromptI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function RenderTemplate_OR (adm: ActionDataManager) {
            try {
                if (typeof params?.skipOn != 'undefined' && await skipOn(params, adm)) {
                    return;
                }

                const openai = new OpenAI({ apiKey: params.apiKey });

                const messages = params.messages as any ?? [];

                let prompt: string = '';

                if (typeof params.prompt == 'function') {
                    prompt = await params.prompt(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params.prompt == 'string') {
                    prompt = params.prompt;
                }

                messages.push({ role: 'user', content: `Here is the prompt "${prompt}"` });

                const pms: OpenAI.Chat.ChatCompletionCreateParams = {
                    model: params?.model ?? 'gpt-3.5-turbo',
                    messages: messages,
                };

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(
                        adm,
                        new LogicChain(adm, this.logger),
                        prompt
                    );
                }

                // OpenAI.Chat.ChatCompletion
                let result: any = await openai.chat.completions.create(pms);

                result = {
                    id: result?.id,
                    message: result?.choices?.[0]?.message?.content ?? {},
                }

                try {
                    result.message = result.message.replace(/\\t/g, '');
                }
                catch (err) {}

                let outputChanged = false;

                adm.previousStepSuccessful = true;

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(result, 'CreateOne');

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

                if (typeof params?.output === 'function') {
                    outputChanged = true;
                    result = await params.output(adm, new LogicChain(adm, this.logger), result);
                }

                adm.setSuccess(`Successfully retrieved open ai response`);
                adm.setResultInternal(result, 'PromptAI');

                if (typeof params?.onSuccess == 'function') {
                    outputChanged = true;
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }
            }
            catch (err) {
                adm.setError(`AskAI Error: Could not retrieve Open AI response. Error: "${err.message ?? err}"`);
            }
        };

        addActionToQueue(target, cb, 'AskAI', params);
    };
}