import { isPromise } from '../../libs/ObjectMethods';
import { getLogger } from '../..';
import { BaseModel } from '../../base';
import { ActionDataManager, LogicChain } from '../../classes';

import EActionArgsI from '../../interfaces/EActionArgsI';
import PDC from '../../classes/ProjectDependancyCaches';

function processPropsToValue(out: any, props: any, propertyKey: any, value: any) {
    if (typeof props.serializeProperty != 'undefined' && !(!!props.serializeProperty)) {
        return;
    }

    if (typeof value === 'undefined') return;

    if (props?.serializePropsToOutput) return Object.assign(out, value);

    out[propertyKey] = value;
}

export function EActionInput(args: EActionArgsI = {}) {
    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        const clssName = constructor.name;

        constructor.prototype.mainClassName = clssName;

        let entProps = {};

        try {
            entProps = PDC.getEntityProps(clssName);
        }
        catch (err) {
            //console.log(`There was an error getting props for "${clssName}"`, err);
        }

        Object.defineProperty(constructor, 'inputProps', { value: entProps, writable: false });

        const ExtendedActionInputCont = class ExtendedActionInput extends constructor {
            logger = getLogger();

            initData(adm: ActionDataManager) {
                const self: any = this;

                for (const k in self?.propMapperCbs) {
                    const cb = self?.propMapperCbs[k] ?? undefined;
                    if (typeof cb == 'function') cb(
                        adm,
                        'EActionInput:decorator: initData',
                    );
                }
            }
            async serialize(adm: ActionDataManager) {
                const self: any = this, out: any = {};

                try {
                    // first we get all the properties that have been registered with a valid model property decorator
                    // these are compileted into an object in the main BaseModel class via the method "initClassKeyRefs"
                    // method in the @eezze/decorators/models/types file
                    const modelKeys = BaseModel.getClassProperties(constructor.name);

                    // then need to loop over each of the properies in the modelKeys array and set all
                    // the properties of the out object to the the class property "getters" or the getter
                    // over rides in the class if they exist
                    for (const k in modelKeys) {
                        const props: any = self._propertyDecoratorArgs[k] ?? {};

                        let propValue;

                        // return the value of the serializer "cb" / getter override
                        if (typeof self._serializeKeyOverrides[k] == 'function') {
                            const cb = self._serializeKeyOverrides[k];

                            // here is where we take care of the async getters / serializers
                            if (isPromise(cb)) propValue = await cb(
                                self,
                                adm,
                                'EActionInput:decorator: serialize promise'
                            );
                            // this is the non async varient
                            else propValue = cb(
                                self,
                                adm,
                                'EActionInput:decorator: serialize none promise'
                            );
                        }
                        // set to the class value for default
                        else propValue = self[k];

                        // here we need to propcess the value based on the stored props (i.e. if a custom serializer)
                        // function exists in th passed props then we call the callback to trasform the value from here
                        processPropsToValue(out, props, k, propValue);
                    }

                    return out;
                }
                catch (e) {
                    console.log('EValidator decorator: ', e);

                    const message = `Error serializing model: ${constructor.name}: ${e.message}`;
                    console.log(message);
                    self.logger.error(message, 'EActionInput: serialize: catch', adm);
                }
            }
            async validate(adm: ActionDataManager) {
                const self: any = this;
                this.initData(adm);

                for (const k in self.propValidationCbs) {
                    const cb = self?.propValidationCbs[k] ?? undefined;

                    if (typeof cb == 'function') {
                        await cb(adm, 'EActionInput:decorator: validate');
                    }
                }

                return Object.keys(adm.request.validationErrors).length == 0;
            }
        };

        PDC.registerActionInput(constructor.name, ExtendedActionInputCont);

        return ExtendedActionInputCont;
    }
}

export async function skipOn(params: any, adm: ActionDataManager) {
    try {
        if (Array.isArray(params?.skipOn)) {
            for (const cond of params.skipOn) {
                if (typeof cond == 'function') {
                    if (await cond(adm, new LogicChain(adm, adm.logger))) {
                        adm.skipAction();
                        return true;
                    }
                }
                else {
                    if (await cond.condition(adm, new LogicChain(adm, adm.logger))) {
                        let msg = '';

                        if (typeof cond.message == 'function') {
                            msg = await cond.message(adm, new LogicChain(adm, adm.logger));
                        }
                        else msg = cond?.message ?? 'skipOn condition met';

                        adm.logger.info(msg);

                        adm.skipAction();
                        return true;
                    }
                }
            }
        }
    }
    catch (err) {
        console.log(`There was an error running your skipped on "${err?.message ?? err}"`);
    }
}

export * from './ActionDecorators';
export * from './ActionQueries';
export * from './file-actions';
export * from './content-conversion';
export * from './logic';
export * from './misc';
export * from './response';
export * from './ai';
export * from './Email';