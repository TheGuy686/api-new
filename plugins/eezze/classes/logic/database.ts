import ProjectDependancyCaches from '../../classes/ProjectDependancyCaches';
import ActionDataManager from '../../classes/ActionDataManager';
import GlobalConsts from '../../global-consts';
import { isPromise } from '../../libs/ObjectMethods';
import { pluralize } from '../../libs/StringMethods';

export default class EDatabase {
    static async GetAll(
        adm: ActionDataManager,
        repo: any,
        input?: (adm: ActionDataManager) => object,
        columns?: any,
        where?: any,
        transformResult?: (res: any[], adm: ActionDataManager) => any [],
        returnResultAsObjects?: boolean,
    ) {
        try {
            let inp: any;

            if (typeof input == 'function') {
                inp = input(adm);
            }
            else {
                inp = adm.nextActionInput;
            }

            let dbRes: any;

            if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repo.ds.type)) {
                dbRes = await repo.findBy(inp, adm.input);
            }
            else {
                dbRes = await repo.findBy(where, columns);
            }

            if (!dbRes) throw dbRes.error;

            let res = await repo.model.fromObjs(dbRes, returnResultAsObjects ?? false, adm)

            if (typeof transformResult === 'function') {
                res = transformResult(res, adm)
            }

            let result = [];

            if (typeof returnResultAsObjects !== undefined && returnResultAsObjects) {
                result = res;
            }
            else {
                for (const item of res) {
                    result.push(await item.serialize());
                }
            }

            return result;
        }
        catch (e) {
            const em = `Action Query Decorators: GetAll: "${e.message || e}"`;

            console.log('Action Query Decorators: GetAll: ', e);

            // context.logger.errorI(`A ${context.targetEntity} with that criteria doesn't exist yet`);
            repo.logger.errorI(`GetAll:descriptor-override repo.findBy: ${e.message}`, 'EDatabase: catch');

            adm.previousStepSuccessful = false;
            adm.setError(em);

            throw em;
        }
    }

    static async GetOne(
        adm: ActionDataManager,
        repo: any,
        checkOn: string[],
        maximumDepth?: number,
        input?: (adm: ActionDataManager) => object,
        columns: string[] = [],
    ) {
        try {
            let whereKeys = checkOn ?? [], payload: any, one: any;
            let readFileVarsI: object;
            let dbRes: any;
            const results: any[] = [];
            let inputCustom: any, repoCustom: any;

            if (repo) {
                repoCustom = ProjectDependancyCaches.getRepo(repo);
            }
            else {
                repoCustom = repo;
            }

            if (typeof input == 'function') {
                inputCustom = isPromise(input) ? await input(adm) : input(adm);
            }
            else {
                inputCustom = adm.nextActionInput;
            }

            if (Object.keys(whereKeys).length > 0) {
                payload = Object.fromEntries(Object.entries(inputCustom).filter(
                    ([key]) => whereKeys.includes(key))
                );
            }
            else payload = inputCustom;

            if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repoCustom.ds.type)) {
                dbRes = await repoCustom.findOneBy(payload, adm.input);
            }
            else {
                dbRes = await repoCustom.findOneBy(payload, columns, maximumDepth);
            }

            if (!dbRes) {
                return {
                    success: false,
                    error: `No ${pluralize(repoCustom.group)} existed with those criteria`
                }
            }

            if (GlobalConsts.DS_QUERY_VAR_MERGE_TYPES.includes(repoCustom.ds.type)) {
                one = await repoCustom.model.fromObj(dbRes);

                return {
                    success: true,
                    result: await one.serialize(false, false, adm)
                }
            }

            // SQL results, even getOne, can have mutiple row results. Use fromObjs to serialize always. Return object is an Array with 1 record
            one = await repoCustom.model.fromObjs(dbRes);

            for (const item of one) {
                results.push(await item.serialize(false, false, adm));
            }

            return repoCustom.model.deDuplicate(results)[0];

        }
        catch (err) {
            const em = `ActionQueries.GetOne.Error: "${err.message || err}"`;
            adm.logger.warnI(em);
            adm.previousStepSuccessful = false;
            adm.setError(em);
        }
    }
}