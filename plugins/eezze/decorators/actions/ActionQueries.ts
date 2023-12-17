import { flattenObj, mergeObjects } from '../../libs/ObjectMethods';
import { pluralize } from '../../libs/StringMethods';
import { addActionToQueue } from './ActionDecorators';
import ADM from '../../classes/ActionDataManager';
import GlobalConsts from '../../global-consts';
import PDC from '../../classes/ProjectDependancyCaches';
import LogicChain from '../../classes/logic/LogicChain';

interface WhereArgsI {
    [key: string]: [value: string | number | boolean]
}

interface QueryParamsI {
    id?: string;
    returnStructure?: boolean;
    input?: E_CM_CB_ANY;
    output?: E_CM_CB_ANY;
    maximumDepth?: number;
    repo?: string;
    debug?: boolean;
    errorMessage?: string;
    failOnEmpty?: E_CM_CB_BOOL | boolean;
    failOn?: ECONDITIONAL_ITEM[];
    beforeExec?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
}

interface RawQueryParamsI {    id?: string;
    returnStructure?: boolean;
    failOn?: ECONDITIONAL_ITEM[];
    query?: E_CM_CB_STR;
    input?: (adm: ADM, lc?: LogicChain) => SQL_QUERY_PARAMS;
    output?: E_CM_CB_ANY;
    maximumDepth?: number;
    repo?: string;
    returnAsModel?: boolean;
    failOnEmpty?: E_CM_CB_BOOL | boolean;
    beforeExec?: E_CM_CB_ANY | any;
    onSuccess?: E_CM_CB_VOID;
    errorMessage?: string;
}

interface GetOneParamsI extends QueryParamsI {
    checkOn: string[];
}

interface CreateUpdateOneParamsI extends QueryParamsI {
}

interface GetOneAndUpdateParamsI extends QueryParamsI {
    checkOn: string[];
    withValues?: (adm: ADM, lc?: LogicChain) => any;
    getOnefailOn?: ECONDITIONAL_ITEM[];
}

interface CreateOneIfNotExistsArgsI extends QueryParamsI {
    checkOn: string[];
    failOnExists?: boolean;
    withValues?: (adm: ADM, lc?: LogicChain) => any;
}

interface GetListParamsI extends QueryParamsI {
    returnResultAsObjects?: boolean;
    columns?: (adm: ADM, lc?: LogicChain) => string[];
    checkOn?: ((adm: ADM, lc?: LogicChain) => string[]) | string[];
}

type INSERT_UPDATE_TYPE = {
    success: boolean;
    result?: any;
    error?: string;
    previous?: any;
}

async function _query(
    sql: string,
    bindParams: [string | number | boolean][],
    repo: any,
    adm: ADM
) {
    try {
        // const results: any[] = [];

        const dbRes = await repo.query(sql, bindParams);

        if (!dbRes) {
            return {
                success: false,
                error: `No ${pluralize(repo.group)} existed with those criteria`
            }
        }

        // SQL results, even getOne, can have mutiple row results. Use fromObjs to serialize always. Return object is an Array with 1 record
        // const modelObjects = await repo.model.fromObjs(dbRes);

        /*for (const item of modelObjects) {
            results.push(await item.serialize(false, false, adm));
        }*/

        return {
            success: true,
            // result: dbRes //repo.model.deDuplicate(results),
            // result: repo.model.fromObjs(results),
            // result: repo.model.deDuplicate(results),
            result: dbRes
        }
    }
    catch (e) {
        // console.log('Action Query Decorators: _query: ', e);

        repo.logger.error(`A ${repo.group} with that criteria doesn't exist yet`, 'ActionQueries: _query: catch', adm);
        repo.logger.error('Query:descriptor-override MysqlQuery->repo.query: ' + e.message, 'ActionQueries: _query: catch', adm);

        return {
            success: false,
            error: `Action Query Decorators: _query: "${e.message || e}"`
        }
    }
}

async function _getOne(
    where: WhereArgsI | WhereArgsI[],
    repo: any,
    adm: ADM,
    serialize: boolean = true,
    readFileVars?: object,
    maximumDepth?: number,
    debug: boolean = false,
) {
    try {
        let readFileVarsI: object;
        let dbRes: any;
        let one: any;
        const results: any[] = [];

        if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
            readFileVarsI = readFileVars ?? {}

            dbRes = await repo.findOneBy(where, readFileVarsI);
        }
        else {
            // built in support for override of column selection
            const columns: string[] = [];

            dbRes = await repo.findOneBy(where, columns, maximumDepth);
        }

        if (!dbRes) {
            return {
                success: false,
                error: `No ${pluralize(repo.group)} existed with those criteria`
            }
        }

        if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
            one = await repo.model.fromObj(dbRes);

            return {
                success: true,
                result: serialize ? await one.serialize(false, false, adm) : one
            }
        }

        // SQL results, even getOne, can have mutiple row results. Use fromObjs to serialize always. Return object is an Array with 1 record
        one = await repo.model.fromObjs(dbRes);

        for (const item of one) {
            results.push(await item.serialize(false, false, adm));
        }

        const deduplicated = repo.model.deDuplicate(results)[0];

        return {
            success: true,
            result: deduplicated
        }
    }
    catch (e) {
        // console.log('Action Query Decorators: _getOne: ', e);

        repo.logger.error(
            `A ${repo.group} with that criteria doesn't exist yet`,
            'ActionQueries: _query: _getOne: catch',
            adm,
        );
        repo.logger.error(
            'GetOne:descriptor-override MysqlGetOne->repo.findBy: ' + e.message, 
            'ActionQueries: _query: _getOne: catch',
            adm,
        );

        return {
            success: false,
            error: `Action Query Decorators: _getOne: "${e.message || e}"`
        }
    }
}

async function insertUpdate(
    decArgs: any,
    entityObj: any,
    repo: any,
    isCreate: boolean = true,
    updateProperties: any = {},
    readFileVars?: object,
    adm?: ADM,
    isReplace: boolean = false,
    debug: boolean = false,
) {
    let readFileVarsI: object;

    if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
        readFileVarsI = readFileVars ?? {}
    }

    const operationName = isCreate ? 'CreateOne' : 'UpdateOne';

    if (debug) repo.logger.infoI(`insertUpdate: constructor:name: "${repo.constructor.name}"`);

    try {
        if (debug) repo.logger.infoI(`insertUpdate: ${isCreate ? 'CREATE' : 'UPDATE'}: entityObj: ${JSON.stringify(entityObj, null, 4)}`);

        const model = repo.model.fromObj(entityObj);

        const dbRes = await repo.save(model, updateProperties, isCreate, decArgs, readFileVarsI, adm, isReplace);

        return {
            success: true,
            result: dbRes.newMdl,
            previous: dbRes.oldMdl,
        }
    }
    catch (e) {
        // console.log('Action Query Decorators: insertUpdate: ', e);

        const message = `${operationName}:descriptor-override repo.save: ${e.message}`;

        repo.logger.error(
            `Action Query Decorators: insertUpdate: "${message}"`,
            'ActionQueries: _query: insertUpdate: ctach',
            adm,
        );

        return {
            success: false,
            error: `Action Query Decorators: insertUpdate: "${e.message || e}"`
        }
    }
}

export function Query(params: RawQueryParamsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function Query_OR(adm: ADM) {
            let input: any, repo: any;

            try {
                adm.setAction('Query_OR: ' + adm.totalActions, params?.id);

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                const lc = new LogicChain(adm, this.logger);

                const query = await params.query(adm, new LogicChain(adm, this.logger));

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                const res = await _query(
                    query,
                    input,
                    repo,
                    adm
                );

                if (typeof params?.returnAsModel == 'undefined') {
                    params.returnAsModel = true;
                }

                if (params.returnAsModel) {
                    let tres = await repo.model.fromObjs(res.result),
                        result: any = [];

                    if (Array.isArray(tres)) {
                        for (const item of tres) {
                            result.push(await item.serialize(false, false, adm));
                        }

                        result = repo.model.deDuplicate(result);
                    }
                    else result.push(await result.serialize(false, false, adm));

                    res.result = result;
                }

                if (!res.success) throw res.error;

                let failOnEmpty = false;

                if (typeof params?.failOnEmpty == 'function') {
                    failOnEmpty = await params?.failOnEmpty(adm, new LogicChain(adm, this.logger));
                }
                else failOnEmpty = !!params?.failOnEmpty;

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(res.result, 'Query');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`Query "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'Query');
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
                                adm.setResultInternal({}, 'Query');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                if (typeof res?.result == 'undefined' && failOnEmpty) {
                    throw `Query: There was no results for query "${query}"`;
                }

                if (typeof params?.output === 'function') {
                    res.result = await params.output(adm, new LogicChain(adm, this.logger), res.result)
                }

                adm.previousStepSuccessful = true;
                adm.setResultInternal(res.result, 'Query');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->ActionQueries->Query Success', 'Decorators->ActionQueries->Query Success', adm, ['info']);
            }
            catch (err) {
                const em = `ActionQueries.Query.Error->Repo "${repo.prototype.name}": "${err.message || err}"`;
                this.logger.warnI(em);
                adm.previousStepSuccessful = false;
                adm.setError(em);
            }
        }

        addActionToQueue(target, cb.bind(target), 'Query', params);
    }
}

export function GetOne(params: GetOneParamsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function GetOne_OR(adm: ADM) {
            let whereKeys = params?.checkOn ?? [], payload: any, input: any, repo: any;

            try {
                adm.setAction('GetOne_OR: ' + adm.totalActions, params?.id);

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                if (Object.keys(whereKeys).length > 0) {
                    payload = Object.fromEntries(Object.entries(input).filter(
                        ([key]) => whereKeys.includes(key))
                    );
                }
                else payload = input;

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                const res = await _getOne(payload, repo, adm, true, adm.input, params.maximumDepth, params?.debug);

                if (!res.success) throw res.error;

                let failOnEmpty = false;

                if (typeof params?.failOnEmpty == 'function') {
                    failOnEmpty = await params?.failOnEmpty(adm, new LogicChain(adm, this.logger));
                }
                else failOnEmpty = !!params?.failOnEmpty;

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(res.result, 'GetOne');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`GetOne "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'GetOne');
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
                                adm.setResultInternal({}, 'GetOne');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                if (typeof res?.result == 'undefined' && failOnEmpty) {
                    if (params?.errorMessage) {
                        adm.previousStepSuccessful = false;
                        adm.setError(params.errorMessage);
                        adm.setResultInternal({}, 'GetOne->failOnEmpty');
                        return;
                    }

                    throw `GetOne->Repo "${repo.prototype.name}": There was no result found for the given params "${JSON.stringify(payload)}"`;
                }

                if (typeof params?.output === 'function') {
                    res.result = await params.output(adm, new LogicChain(adm, this.logger), res.result);
                }

                adm.previousStepSuccessful = true;
                adm.setResultInternal(res.result, 'GetOne');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info(
                    'Decorators->ActionQueries->GetOne Success', 
                    'Decorators->ActionQueries->GetOne Success', 
                    adm, 
                    ['info']
                );
            }
            catch (err) {
console.log('Err: ', err);
                const em = `ActionQueries.GetOne.Error: "${err.message || err}"`;
                this.logger.warnI(em);
                adm.previousStepSuccessful = false;
                adm.setError(em);
            }
        }

        addActionToQueue(target, cb.bind(target), 'GetOne', params);
    }
}

export function GetOneAndUpdate(params: GetOneAndUpdateParamsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function GetOneAndUpdate_OR(adm: ADM) {
            adm.setAction('GetOneAndUpdate_OR: ' + adm.totalActions, params?.id);

            let whereKeys = params.checkOn ?? [], input: any, payload: any, repo: any;

            if (params?.repo) {
                repo = PDC.getRepo(params?.repo);
            }
            else repo = this.repo;

            if (typeof params.input == 'function') {
                input = await params.input(adm, new LogicChain(adm, this.logger));
            }
            else input = adm.nextActionInput;

            const whereFiltered: any = Object.fromEntries(Object.entries(input).filter(
                ([key]) => whereKeys.includes(key))
            );

            if (Object.keys(whereKeys).length > 0) {
                payload = Object.fromEntries(Object.entries(input).filter(
                    ([key]) => whereKeys.includes(key))
                );
            }
            else payload = input;

            if (typeof params?.beforeExec == 'function') {
                await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
            }

            const existCheck: any = await _getOne(payload, repo, adm, false, adm.input, params.maximumDepth, params?.debug);

            if (!existCheck || !existCheck.success) {
                const em = `Repo "${repo.prototype.name}"Resource doesn't exist with those credentials: ${(() => {
                    const errorItems: string[] = [], flattened: any = flattenObj(whereFiltered);

                    for (const k in flattened) {
                        errorItems.push(`${k}: ${flattened[k]}`);
                    }

                    return errorItems.join(', ');
                })()}`;

                throw em;
            }

            let values = existCheck.result;

            if (Array.isArray(params?.getOnefailOn)) {
                adm.previousStepSuccessful = true;
                adm.setResultInternal(values, 'GetOneAndUpdate');

                for (const cond of params.getOnefailOn) {
                    if (typeof cond == 'function') {
                        if (await cond(adm, new LogicChain(adm, this.logger))) {
                            adm.previousStepSuccessful = false;
                            adm.setError(`GetOneAndUpdate "getOnefailOn" condition was satisfied`);
                            adm.setResultInternal({}, 'GetOneAndUpdate');
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
                            adm.setResultInternal({}, 'GetOneAndUpdate');

                            adm.setError(msg);
                            adm.previousStepSuccessful = false;
                            return;
                        }
                    }
                }
            }

            try {
                if (typeof params?.withValues == 'function') {
                    values = mergeObjects(values, await params.withValues(
                        adm,
                        new LogicChain(adm, this.logger)
                    ));
                }

                const res = await insertUpdate(
                    params,
                    values,
                    repo,
                    false,
                    values,
                    adm.input,
                    adm,
                    false,
                    params?.debug
                );

                if (!res.success) throw res.error;

                adm.previousStepSuccessful = true;

                if (Array.isArray(params?.failOn)) {
                    adm.setResultInternal(res.result, 'GetOneAndUpdate');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setResultInternal({}, 'GetOneAndUpdate');
                                throw `GetOneAndUpdate "failOn" condition was satisfied`;
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
                                adm.setResultInternal({}, 'GetOneAndUpdate');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                throw msg;
                            }
                        }
                    }
                }

                if (typeof params?.output === 'function') {
                    res.result = await params.output(adm, new LogicChain(adm, this.logger), res.result)
                }

                adm.setResultInternal(res.result, 'GetOneAndUpdate');

                this.logger.info('Decorators->ActionQueries->GetOneAndUpdate Success', 'Decorators->ActionQueries->GetOneAndUpdate Success', adm, ['info']);

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                return res;
            }
            catch (e) {
                const em = `Decorators.ActionQueries.GetOneAndUpdate.error->Repo "${repo.prototype.name}": "${e.message || e}"`;

                adm.previousStepSuccessful = false;
                adm.setError(e.message || e);

                this.logger.warnI(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'addActionToQueue', params);
    }
}

export function GetList(params: GetListParamsI = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function GetList_OR(adm: ADM) {
            try {
                adm.setAction('GetList_OR: ' + adm.totalActions, params?.id);

                let whereKeys: string[] = [];

                if (typeof params?.checkOn == 'function') {
                    whereKeys = await params.checkOn(adm, new LogicChain(adm, this.logger));
                }

                let payload: any, input: any;
                let res, repo;
                let dbRes: any, columns: string[] = [];

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                if (Object.keys(whereKeys).length > 0) {
                    payload = Object.fromEntries(Object.entries(input).filter(
                        ([key]) => whereKeys.includes(key))
                    );
                }
                else payload = input;

                if (typeof params?.columns === 'function') {
                    columns = await params.columns(adm, new LogicChain(adm, this.logger));
                }

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
                    dbRes = await repo.findBy(payload, adm.input);
                }
                else dbRes = await repo.findBy(payload, columns, params.maximumDepth);

                if (!dbRes) throw dbRes.error;

                adm.previousStepSuccessful = true;

                res = await repo.model.fromObjs(dbRes);

                let failOnEmpty = false;

                if (typeof params?.failOnEmpty == 'function') {
                    failOnEmpty = await params?.failOnEmpty(adm, new LogicChain(adm, this.logger));
                }
                else failOnEmpty = !!params?.failOnEmpty;

                if ((!Array.isArray(res) || res.length == 0) && failOnEmpty) {
                    throw `GetList->Repo "${repo.prototype.name}": There was no results for given params "${JSON.stringify(payload)}"`;
                }

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(res, 'GetList');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`GetList "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'GetList');
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
                                adm.setResultInternal({}, 'GetList');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                let result = [];
                let retStruct;

                if (typeof params?.returnResultAsObjects !== undefined && params?.returnResultAsObjects) {
                    result = res;
                }
                else {
                    if (Array.isArray(res)) {
                        for (const item of res) {
                            result.push(await item.serialize(false, false, adm));
                        }
                        result = repo.model.deDuplicate(result);
                        if (params.returnStructure) retStruct = repo.model.getReturnStructure();
                    }
                    else result.push(await res.serialize(false, false, adm));
                }

                if (typeof params?.output === 'function') {
                    result = await params.output(adm, new LogicChain(adm, this.logger), result);
                }

                if (params.returnStructure) adm.setResultInternal({ result, structure: retStruct }, 'GetList->if');
                else adm.setResultInternal(result, 'GetList->else');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->ActionQueries->GetList Success', 'Decorators->ActionQueries->GetList Success', adm, ['info']);
            }
            catch (e) {
                const em = `Action Query Decorators: GetList: "${e.message || e}"`;

                // console.log('Action Query Decorators: GetList: ', e);

                this.logger.error(`A ${target.targetEntity} with that criteria doesn't exist yet`, 'ActionQueries: _query: GetList: catch', adm);
                this.logger.error(`GetList:descriptor-override repo.findBy: ${e.message}`, 'ActionQueries: _query: GetList: catch', adm);

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'GetList', params);
    };
}

export function DeleteOne(params: GetOneParamsI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function DeleteOne_OR(adm: ADM) {
            try {
                adm.setAction('DeleteOne_OR: ' + adm.totalActions, params?.id);

                let whereKeys = params?.checkOn ?? [], payload: any, input: any, repo: any;

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                if (Object.keys(whereKeys).length > 0) {
                    payload = Object.fromEntries(Object.entries(input).filter(
                        ([key]) => whereKeys.includes(key))
                    );
                }
                else payload = input;

                let dbRes: any, maxDepth = params?.maximumDepth ?? 0;

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
                    dbRes = await repo.findOneBy(payload, adm.input);
                }
                else {
                    const columns: string[] = [];

                    dbRes = await repo.findOneBy(payload, columns, maxDepth);
                }

                if (!dbRes) throw `Repo "${repo.prototype.name}"No ${pluralize(repo.group)} existed with those criteria`;

                let mdl, result: any[] = [];

                // this decorator should be called Delete, depending on the "where" clause, more than 1 row can be returned.
                // findOneBy is also not strictly 1 row because there can be relationships that will result in more than 1 row that needs to be consolidated into 1 object.
                // the findOneBy is therefore more in context of the model, rather than the context of the database.
                if (Array.isArray(dbRes)) {
                     mdl = repo.model.fromObjs(dbRes);

                     for (const mdlObj of mdl) {
                         result.push(await repo.remove(mdlObj));
                     }
                 }
                else {
                    mdl = repo.model.fromObj(dbRes);
                    result.push(await repo.remove(mdl));
                }

                if (result.length === 0) throw `There was an internal server error`;

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(result, 'DeleteOne');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`DeleteOne "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'DeleteOne');
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
                                adm.setResultInternal({}, 'DeleteOne');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                adm.previousStepSuccessful = true;
                adm.setSuccess(`Successfully deleted a/an ${repo.group}`);

                if (typeof params?.output === 'function') {
                    result = await params.output(adm, new LogicChain(adm, this.logger), result);
                }

                adm.setResultInternal(result, 'DeleteOne');

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->ActionQueries->DeleteOne Success', 'Decorators->ActionQueries->DeleteOne Success', adm, ['info']);
            }
            catch (e) {
                const em = `Action Query Decorators: DeleteOne: "${e.message || e}"`;

                // console.log('Action Query Decorators: MysqlDeleteOne: ', e);

                this.logger.error(`A ${target.targetEntity} with that criteria doesn't exist yet`, 'ActionQueries: _query: DeleteOne: catch', adm);
                this.logger.error(`MysqlDeleteOne:descriptor-override repo.save: ${e.message}`, 'ActionQueries: _query: DeleteOne: catch', adm);

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'DeleteOne', params);
    };
}

export function CreateOne(params: CreateUpdateOneParamsI = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function CreateOne_OR(adm: ADM) {
            try {
                adm.setAction('CreateOne_OR: ' + adm.totalActions, params?.id);

                let input: any, repo: any;

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                let res;

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
                    res = await insertUpdate(params, input, repo, true, null, adm.input, adm, false, params?.debug);
                }
                else {
                    res = await insertUpdate(params, input, repo, true, null, adm.input, adm, false, params?.debug);
                }

                if (!res.success) throw res.error;

                let failOnEmpty = false;

                if (typeof params?.failOnEmpty == 'function') {
                    failOnEmpty = await params?.failOnEmpty(adm, new LogicChain(adm, this.logger));
                }
                else failOnEmpty = !!params?.failOnEmpty;

                if (typeof res?.result == 'undefined' && failOnEmpty) {
                    throw `CreateOne->Repo "${repo.prototype.name}": There was no results for given params "${JSON.stringify(input)}"`;
                }

                adm.previousStepSuccessful = true;

                if (Array.isArray(params?.failOn)) {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(res.result, 'CreateOne');

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
                    res.result = await params.output(adm, new LogicChain(adm, this.logger), res.result);
                }

                adm.setResultInternal(res.result, 'CreateOne');

                if (res.result.success) adm.setSuccess(`Successfully created an entity`);

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->ActionQueries->CreateOne Success', 'Decorators->ActionQueries->CreateOne Success', adm, ['info']);
            }
            catch (e) {
                const em = `Action Query Decorators: CreateOne: "${e.message || e}"`;

                // console.log('Action Query Decorators: MysqlCreateOne: ', e);

                this.logger.error(
                    `MysqlCreateOne:descriptor-override repo.save: ${e.message}`,
                    'ActionQueries: _query: CreateOne: catch',
                    adm,
                );

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'CreateOne', params);
    };
}

export function ReplaceOne(params: CreateUpdateOneParamsI = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function ReplaceOne_OR(adm: ADM) {
            try {
                adm.setAction('ReplaceOne_OR: ' + adm.totalActions, params?.id);

                let input: any, repo: any;

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params?.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                let res;

                if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
                    res = await insertUpdate(params, input, repo, false, null, adm.input, adm, true);
                }
                else res = await insertUpdate(params, input, repo, false, null, adm.input, adm, true);

                if (!res.success) throw res.error;

                let failOnEmpty = false;

                if (typeof params?.failOnEmpty == 'function') {
                    failOnEmpty = await params.failOnEmpty(adm, new LogicChain(adm, this.logger));
                }
                else failOnEmpty = !!params?.failOnEmpty;

                if (typeof res?.result == 'undefined' && failOnEmpty) {
                    throw `ReplaceOne->Repo "${repo.prototype.name}": There was no results for given params "${JSON.stringify(input)}"`;
                }

                adm.previousStepSuccessful = true;

                if (Array.isArray(params?.failOn)) {
                    adm.setResultInternal(res.result, 'ReplaceOne');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`ReplaceOne "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'ReplaceOne');
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
                                adm.setResultInternal({}, 'ReplaceOne');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                if (typeof params?.output === 'function') {
                    res.result = await params.output(adm, new LogicChain(adm, this.logger), res.result)
                }

                adm.setResultInternal(res.result, 'ReplaceOne');
                adm.setSuccess(`Successfully created an entity`);

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info('Decorators->ActionQueries->ReplaceOne Success', 'Decorators->ActionQueries->ReplaceOne Success', adm, ['info']);
            }
            catch (e) {
                const em = `Action Query Decorators: ReplaceOne: "${e.message || e}"`;

                // console.log('Action Query Decorators: MysqlReplaceOne: ', e);

                this.logger.error(
                    `MysqlReplaceOne:descriptor-override repo.save: ${e.message}`,
                    'ActionQueries: _query: ReplaceOne: catch',
                    adm,
                );

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'ReplaceOne', params);
    };
}

export function UpdateOne(params: CreateUpdateOneParamsI = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function UpdateOne_OR(adm: ADM) {
            try {
                adm.setAction('UpdateOne_OR: ' + adm.totalActions, params?.id);

                let input, repo: any;

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                const res = await insertUpdate(params, input, repo, false, input, adm.input, adm, false, params?.debug);

                if (!res.success) throw res.error;

                adm.currentAction.setPreviousResult(res.previous, 'ActionQueries->UpdateOne');

                let failOnEmpty = false;

                if (typeof params?.failOnEmpty == 'function') {
                    failOnEmpty = await params?.failOnEmpty(adm, new LogicChain(adm, this.logger));
                }
                else failOnEmpty = !!params?.failOnEmpty;

                if (typeof res?.result == 'undefined' && failOnEmpty) {
                    throw `UpdateOne->Repo "${repo.prototype.name}": There was no results for given params "${JSON.stringify(input)}"`;
                }

                adm.previousStepSuccessful = true;

                if (Array.isArray(params?.failOn)) {
                    adm.setResultInternal(res.result, 'UpdateOne');

                    for (const cond of params.failOn) {
                        if (typeof cond == 'function') {
                            if (await cond(adm, new LogicChain(adm, this.logger))) {
                                adm.previousStepSuccessful = false;
                                adm.setError(`UpdateOne "failOn" condition was satisfied`);
                                adm.setResultInternal({}, 'UpdateOne');
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
                                adm.setResultInternal({}, 'UpdateOne');

                                adm.setError(msg);
                                adm.previousStepSuccessful = false;
                                return;
                            }
                        }
                    }
                }

                if (typeof params?.output === 'function') {
                    res.result = await params.output(
                        adm,
                        new LogicChain(adm, this.logger),
                        res.result,
                    )
                }

                adm.setResultInternal(res.result, 'UpdateOne');
                adm.setSuccess(`Successfully updated an entity`);

                if (typeof params?.onSuccess == 'function') {
                    await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                }

                this.logger.info(
                    'Decorators->ActionQueries->UpdateOne Success',
                    'Decorators->ActionQueries->UpdateOne Success',
                    adm,
                    ['info'],
                );
            }
            catch (e) {
                const em = `Action Query Decorators: UpdateOne: "${e.message || e}"`;

                // console.log('Action Query Decorators: UpdateOne: ', e);

                this.logger.error(
                    `MysqlUpdateOne:descriptor-override: ${e.message}`,
                    'ActionQueries: _query: UpdateOne: catch',
                    adm,
                );

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'UpdateOne', params);
    };
}

export function CreateOneIfNotExists(params: CreateOneIfNotExistsArgsI = { checkOn: [] }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function CreateOneIfNotExists_OR(adm: ADM) {
            try {
                adm.setAction('CreateOneIfNotExists_OR: ' + adm.totalActions, params?.id);

                let whereKeys = params.checkOn ?? [], input: any, repo: any;
                let values: any = {};

                if (params?.repo) {
                    repo = PDC.getRepo(params?.repo);
                }
                else repo = this.repo;

                if (typeof params.input == 'function') {
                    input = await params.input(adm, new LogicChain(adm, this.logger));
                }
                else input = adm.nextActionInput;

                const whereFiltered: any = Object.fromEntries(Object.entries(input).filter(
                    ([key]) => whereKeys.includes(key))
                );

                const wheresIn: any[] = [];

                for (const k in whereFiltered) {
                    const kIn: any = {};
                    kIn[k] = whereFiltered[k];
                    wheresIn.push(kIn);
                }

                if (typeof params?.withValues == 'function') {
                    values = mergeObjects(values, await params.withValues(
                        adm,
                        new LogicChain(adm, this.logger)
                    ));
                }

                if (typeof params?.beforeExec == 'function') {
                    await params.beforeExec(adm, new LogicChain(adm, this.logger), input);
                }

                // const existCheck: any = await _getOne(wheresIn, repo, adm, true, adm.input, params.maximumDepth, params?.debug);
                const existCheck: any = await _getOne(wheresIn, repo, adm, true, input, params.maximumDepth, params?.debug);

                /**
                 * If entry already exists, don't throw an error but return the issue log.
                 */
                if (existCheck && existCheck.success && existCheck.result && Object.keys(existCheck.result).length > 0) {
                    const props = Object.keys(existCheck.result);

                    if (params?.failOnExists) {
                        // throw `A database entry already existed with that criteria`;
                        adm.previousStepSuccessful = false;
                        adm.setError(`A database entry already existed with that criteria`);
                        return;
                    }

                    /** If there's a duplicate, the key property will be set, otherwise it's a default value */
                    for (const prop of wheresIn) {
                        const propKey = Object.keys(prop)[0]

                        for (const objectProp of props) {
                            if (propKey === objectProp) {
                                const errorItems: string[] = [];
                                const flattened: any = flattenObj(whereFiltered);

                                for (const k in flattened) {
                                    errorItems.push(`${k}: ${flattened[k]}`);
                                }

                                const createErrors: string = errorItems.join(', ');

                                // @Rolf - I think this is an error. We need to check through this.
                                adm.previousStepSuccessful = true;
                                adm.setResultInternal(existCheck.result, 'CreateOneIfNotExists->if');
                            }
                        }
                    }

                    if (typeof params?.output === 'function') {
                        existCheck.result = await params.output(adm, new LogicChain(adm, this.logger), existCheck.result);

                        adm.setResultInternal(existCheck.result, 'CreateOneIfNotExists->output');
                    }

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }

                    this.logger.info('Decorators->ActionQueries->CreateOneIfNotExists Success', 'Decorators->ActionQueries->CreateOneIfNotExists Success', adm, ['info']);
                }
                else {
                    const res = await insertUpdate(params, input, repo, true, values, adm.input, adm, false, params?.debug);

                    if (!res.success) throw res.error;

                    let failOnEmpty = false;

                    if (typeof params?.failOnEmpty == 'function') {
                        failOnEmpty = await params?.failOnEmpty(adm, new LogicChain(adm, this.logger));
                    }
                    else failOnEmpty = !!params?.failOnEmpty;

                    if (typeof res?.result == 'undefined' && failOnEmpty) {
                        throw `CreateOneIfNotExists->Repo "${repo.prototype.name}": There was no results for given params "${JSON.stringify(input)}"`;
                    }

                    adm.previousStepSuccessful = true;

                    if (Array.isArray(params?.failOn)) {
                        adm.setResultInternal(res.result, 'CreateOneIfNotExists');

                        for (const cond of params.failOn) {
                            if (typeof cond == 'function') {
                                if (await cond(adm, new LogicChain(adm, this.logger))) {
                                    adm.previousStepSuccessful = false;
                                    adm.setResultInternal({}, 'CreateOneIfNotExists');
                                    adm.setError(`CreateOneIfNotExists "failOn" condition was satisfied`);
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
                                    adm.setResultInternal({}, 'CreateOneIfNotExists');

                                    adm.setError(msg);
                                    adm.previousStepSuccessful = false;
                                    return;
                                }
                            }
                        }
                    }

                    if (typeof params?.output === 'function') {
                        res.result = await params.output(adm, new LogicChain(adm, this.logger), res.result);
                    }

                    adm.setResultInternal(res.result, 'CreateOneIfNotExists->else');
                    adm.setSuccess(`Successfully created an entity`);

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }
                }

                this.logger.info('Decorators->ActionQueries->CreateOneIfNotExists Success', 'Decorators->ActionQueries->CreateOneIfNotExists Success', adm, ['info']);
            }
            catch (e) {
                const em = `Action Query Decorators: CreateOneIfNotExists: "${e.message || e}"`;

                // console.log('Action Query Decorators: CreateOneIfNotExists: ', e);

                this.logger.error(
                    `CreateOneIfNotExists:descriptor-override repo.findBy and repo.save: ${e?.message ?? e}`,
                    'ActionQueries: _query: CreateOneIfNotExists: catch',
                    adm,
                );

                adm.previousStepSuccessful = false;
                adm.setError(em);

                throw em;
            }
        }

        addActionToQueue(target, cb.bind(target), 'CreateOneIfNotExists', params);
    };
}