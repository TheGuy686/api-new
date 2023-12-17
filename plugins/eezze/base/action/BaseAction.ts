import Logger from '../../classes/Logger';
import ActionResponse from '../../classes/ActionResponse';
import ActionDataManager from '../../classes/ActionDataManager';
import BaseActionInput from '../BaseActionInput';

import { BadRequestResponse, UnauthResponse, ForbiddenResponse } from '../../classes/ActionResponses';
import { generateRandomString } from '../../libs/StringMethods';
import { BaseModel } from '../models';
import { BaseService } from '..';
import { EezzeRequest, LogicChain } from '../../classes';
import { ExceptionI } from '../../interfaces';

export default class BaseAction {
    protected _id: string = generateRandomString(5);
    protected roles: string[] = [];
    protected targetEntity: string;
    protected logger: Logger;
    // protected repo: BaseRepository;
    protected repo: any;
    public service: BaseService;
    protected preCb: Function;
    protected postCb: Function;
    protected execCb: Function;
    protected mainClassName: string;
    protected model: BaseModel;
    protected actionInput: BaseActionInput;
    public mainRepoName: string;
    protected methodOverrides: any = {};
    protected onActionEvents: any = {};
    public request: EezzeRequest;

    protected successCb: Function;
    protected errorCb: Function;

    protected datasources: any = {};
    protected repos: any = {};

    protected actionChain: Function[] = [];
    protected actionChainReversed: boolean = false;

    protected condition: Function;
    protected exceptions: ExceptionI[];

    public getDatasource(dsId: string) {
        if (typeof this.datasources[dsId] === 'undefined') {
            throw new Error(`BaseAction.getDtatsource: Error - DS with id "${dsId}" didn't exist`);
        }

        return this.datasources[dsId];
    }

    public getRepo(repoId: string) {
        if (typeof this.repos[repoId] === 'undefined') {
            throw new Error(`BaseAction.getRepo: Error - Repo with id "${repoId}" didn't exist`);
        }

        return this.repos[repoId];
    }

    private successCbDefault: Function = function (adm: ActionDataManager): ActionResponse {
        // this.logger.success(`7. SUCCESS FROM DEFAULT "BaseAction:${this.mainClassName}" MAIN ACTION: ${JSON.stringify(adm.result, null, 4)}`);
        return new ActionResponse(adm.getSuccessResponse(), adm);
    };

    private errorCbDefault: Function = function (error: any, adm: ActionDataManager, src?: string): ActionResponse {
        this.logger.errorI('7. ERROR FROM DEFAULT "BaseAction" MAIN ACTION: ' + JSON.stringify(error, null, 4) + ' : ' + src, src);

        // if (typeof error == 'object') {return new ActionResponse(error, adm)}

        if (error) adm.setError(error);

        return adm.getErrorResponse();
    };

    public async validate(adm: ActionDataManager) {
        const res = await this.actionInput.validate(adm);

        if (!res) return false;

        return true;
    }

    private async handleSuccess(adm: ActionDataManager, src?: string) {
        if (typeof this.successCb == 'function') {
            await this.successCb(adm, new LogicChain(adm, this.logger));
        }
        else {
            await this.successCbDefault(adm);
        }

        adm.clearStash();

        return {
            result: adm.getSuccessResponse(),
            adm,
        };
    }

    private handleError: Function = async function (error: any, adm: ActionDataManager, src?: string, override?: boolean) {
        // this is here to make sure there is always an error element
        // if there is just a body. This is because the front ends should
        // always have an error for non successful responses
        if (typeof error.body != 'undefined') {
            error.error = { ...error.body };
            delete error.body;
        }

        this.logger.error(
            `BaseAction->handleError: ${src}->Error "${typeof error == 'object' ? JSON.stringify(error) : error}"`,
            'BaseAction->handleError',
            adm
        );

        adm.clearStash();
        // @Rolf - Beware this might change some stuff.
        //         I don't even know why this is here as this was already happening in the "errorCbDefault"
        // adm.setError(error);

        if (typeof this.errorCb == 'function') {
            await this.errorCb(adm, new LogicChain(adm, this.logger), src);

            return {
                result: adm.getErrorResponse(),
                adm,
            };
        }

        // @Rolf - Beware this might change some stuff
        // await this.errorCbDefault(error, adm, src);

        if (error?.statusCode && typeof error['success'] == 'boolean' && override) {
            return {
                result: error,
                adm,
            };
        }

        return {
            result: adm.getErrorResponse(),
            adm,
        };
    }

    private handleExecutionExceptions (adm: ActionDataManager) {
        if (!this.exceptions) return;

        for (const exception of this.exceptions) {
            if (exception.condition(adm)) {
                return exception.name;
            }
        }
    }

    /*
        Execution flow:
            // All these execution run if they exist
            1. Run "Authenticator" service
                1.2. Run "checkRoles"
            2. Run validate & serialize "actionIn`put"
    */
    public async run(request: E_REQUEST, server: any, wsAdm?: ActionDataManager): Promise<ActionResponse> {
        return await new Promise(
            async (resolve: Function, reject: Function) => {
                let actionDataManager;

                try {
                    actionDataManager = new ActionDataManager(request, this.logger);

                    actionDataManager.setState(server.state);

                    if (this.service?.authenticator) {
                        // here we check this because when the entry point to the service is a websocket or other type
                        // of service where they authenticate on connect i.e websockets, where the user authenticates
                        // on establishment of the connection. Then we need to use the same credentials and object that
                        // has been stored the previous ADM instance that was initialized on connection. Then we need to
                        // manually set the roles and the user to the cached objects in the origional ADM
                        if (request.auth.isAuthenticated) {
                            actionDataManager.request.auth.setUser(request.auth.user);
                            actionDataManager.request.auth.setRoles(request.auth.roles);
                        }
                        else {
                            const authRes = await this.service.authenticator.validate(actionDataManager);

                            if (!authRes) {
                                const res: any = new UnauthResponse(
                                    (this.service.authenticator as any).validationErrors
                                );

                                actionDataManager.setResponseCode(res.statusCode);
                                actionDataManager.setError(res?.body?.error);

                                return resolve(
                                    await this.handleError(
                                        res,
                                        actionDataManager,
                                        'BaseAction->run: authenticator:validate'
                                    )
                                );
                            }
                            else {
                                await this.service.authenticator.serialize(actionDataManager, 'BaseAction->run:authenticator');
                            }
                        }

                        if (this.roles && this.roles.length > 0) {
                            if (!request.auth.hasRole(this.roles)) {
                                actionDataManager.logger.error(
                                    `Insufficient ROLE access. Expected "${this.roles.join(', ')}" got "${actionDataManager.request.auth.roles.join(', ')}"`,
                                    'BaseAction->roleCheck'
                                );

                                return resolve(await this.handleError(
                                    new ForbiddenResponse(),
                                    actionDataManager,
                                    'BaseAction->run: checkRoles'
                                ));
                            }
                        }
                    }

                    if (this?.actionInput) {
                        if (!await this.validate(actionDataManager)) {
                            // here we need to invalidate the action so the validation message response works as expected
                            if (actionDataManager.lastActionWasAuth) {
                                actionDataManager.invalidateAuthAction();
                            }

                            return resolve(
                                await this.handleError(
                                    new BadRequestResponse(
                                        request.validationErrors
                                    ),
                                    actionDataManager,
                                    'BaseAction->run: validate',
                                    true
                                )
                            );
                        }
                        actionDataManager.setInput(await this?.actionInput?.serialize(actionDataManager) ?? {});
                    }

                    if (typeof this?.condition === 'function' && !await this?.condition(actionDataManager, new LogicChain(actionDataManager, this.logger))) {
                        actionDataManager.request.addExecutionError('condition-not-satisfied', 'Action condition returned false.');

                        const he = this.handleExecutionExceptions(actionDataManager);

                        if (he) {
                            return resolve(await this.handleSuccess(actionDataManager, 'BaseAction->run: execRun (execCb): condition exception'));
                        }

                        // todo: returns an HTTP 500 code, should be changed to a proper 200
                        return resolve(await this.handleError(
                            'Condition check failed', actionDataManager, 'BaseAction->run: condition (execCb): catch'
                        ));
                    }
                }
                catch (err) { reject(err) }

                // this runs all the main "run / exec" functions per action
                try {
                    if (this.actionChain && this.actionChain.length > 0) {
                        let action: any;

                        // if (!this.actionChainReversed){
                        //     this.actionChainReversed = true;
                        //     this.actionChain.reverse();
                        // }

                        for (action of this.actionChain.sort((a: any, b: any) => {
                            if (a.index >= b.index) return -1;
                            return 1;
                        })) {
                            const cb = action.cb.bind(this);

                            await cb(actionDataManager);

                            if (!actionDataManager.previousStepSuccessful) {
console.log('Erorr response: ', actionDataManager.getErrorResponse());
                                return resolve(await this.handleError(
                                    'There was an unknown error',
                                    actionDataManager,
                                    'BaseAction->run: execRun (execCb) action chain: catch'
                                ));
                            }
                        }
                    }
                    else if (typeof this.execCb == 'function') {
                        await this.execCb(actionDataManager);

                        if (!actionDataManager.previousStepSuccessful) {
                            return resolve(await this.handleError(
                                actionDataManager.actionErrors,
                                actionDataManager,
                                'BaseAction->run: execRun (execCb): Not Success !(res?.success) fail'
                            ));
                        }
                    }
                }
                catch (e) {
// console.log('BaseAction:runExec: ', e);
                    this.logger.errorI('ERROR runExec: ' + (typeof e == 'object' ? JSON.stringify(e) : e), 'BaseAction->run: execRun (execCb): catch');
                    return resolve(await this.handleError(
                        e, actionDataManager, 'BaseAction->run: execRun (execCb): catch'
                    ));
                }

                resolve(await this.handleSuccess(actionDataManager, 'BaseAction->run: execRun (execCb): final success'));
            }
        );
    }
}