import { tr } from '../globals';
import { randDarkColor } from '../StringMethods';
import { ActionDatabase, ActionEmail, ActionFiles, ActionLogic, ActionMisc, ActionResponse, ActionServer } from './Actions';
import LogicChain from './LogicChain';
import { addInd, danger, indentation, info, startAC, startPropLc, startService, subInd } from './StateLogger';

type E_MDL_TYPE = 'static' | 'context-mapping' | 'logic-chain';

interface MenuItem {
    group: string;
    id: string;
    type: string;
    subtype: string;
    key: string;
    title: string;
    example: any;
    arefs?: string[];
    [val: string]: any;
};

export interface EmdlI {
    id: string | number;
    baseType: E_MDL_TYPE;
    property: string;
    name: string;
    desc: string;
    type: string;
    raw: string;
    example: any;
    actions: EmdlI[];
    returns?: string;
    logic?: any;
};

const idLength = 7;

type LOG_STATE = 'active' | 'invalid';
type LOG_LC_ITEM_STATE = 'open' | 'closed';
type LOG_ITEM_TARGET_TYPE = 'state' | 'stash' | 'assignment' | 'actions' | string;

export interface LogI {
    id: string;
    key: string;
    state?: LOG_STATE;
    lcPropState?: LOG_LC_ITEM_STATE;
    lcItemState?: LOG_LC_ITEM_STATE;
    action: string;
    type: string;
    property?: string;
    target?: LOG_ITEM_TARGET_TYPE;
    subtype?: string;
    metadata?: { [key: string]: any } | string;
}

type E_SERVICE_TYPE  = 'rest' | 'websocket' | 'cron';

interface ServiceDefinitionI {
    [key: string | number]:  any;
}

type E_RETURN_TYPES = 'text' | 'number' | 'boolean' | 'dict' | 'list' | 'void';

type E_ACTION_CATEGORY = 'database' | 'files' | 'logic' | 'email' | 'server' | 'misc' | 'response';

// Eezze Action Chain Item = EACI

interface EACISchemaActionI {
    category: E_ACTION_CATEGORY;
    action: string;
}

interface EACISchemaBaseI {
    _action: EACISchemaActionI;
    datasource?: string;
    repo?: string;
    input?: EmdlI[];
    output?: EmdlI[];
    onSuccess?: EmdlI[];
    onError?: EmdlI[];
}

// -------------------------------------------------------- DATABASE START --------------------------------------------------------
// database = EACIDb

interface EACIDbBase extends EACISchemaBaseI {
    entity: string;
    maxDepth?: number;
}

interface EACIDbCreateOneI extends EACIDbBase {}

interface EACIDbDeleteOneI extends EACIDbBase {
    checkOn: EmdlI[];
}

interface EACIDbGetListI extends EACIDbBase {
    checkOn: EmdlI[];
}

interface EACIDbGetOneI extends EACIDbBase {}

interface EACIDbUpdateOneI extends EACIDbBase {
    withValues: EmdlI[];
}

interface EACIDbGetOneIAndUpdate extends EACIDbBase {
    withValues: EmdlI[];
}

interface EACIDbCreateOneIfNotExistsI extends EACIDbBase {
    createValues: EmdlI[];
}

// -------------------------------------------------------- DATABASE END --------------------------------------------------------

// -------------------------------------------------------- FILES START --------------------------------------------------------

interface EACIFilesBase extends EACISchemaBaseI {
    folder?: EmdlI[];
    fileName?: EmdlI[];
}

interface EACIFilesSaveI extends EACIFilesBase {
    fileType: string;
    content: EmdlI[];
}

interface EACIFilesDeleteI extends EACIFilesBase {}

interface EACIFilesReadI extends EACIFilesBase {
    fileType: string;
}

// -------------------------------------------------------- FILES END --------------------------------------------------------

// -------------------------------------------------------- LOGIC START --------------------------------------------------------

interface EACILogicBase extends EACISchemaBaseI {}

interface EACILogicListI extends EACILogicBase {}

interface EACIDataTransformerListI extends EACILogicBase {}

interface EACILogicDoI extends EACILogicBase {}

interface EACILogicWhenI extends EACILogicBase {}

// -------------------------------------------------------- LOGIC END --------------------------------------------------------

// -------------------------------------------------------- EMAIL START --------------------------------------------------------

interface EACIEmailBase extends EACISchemaBaseI {}

interface EACISendSTMPEmailI extends EACIEmailBase {
    to?: EmdlI[];
    from?: EmdlI[];
    fromFirstName?: EmdlI[];
    fromLastName?: EmdlI[];
    subject?: EmdlI[];
    template?: string;
    templateVars?: EmdlI[];
    message?: EmdlI[];
    html?: EmdlI[];
}

// -------------------------------------------------------- EMAIL END --------------------------------------------------------

// -------------------------------------------------------- SERVER START --------------------------------------------------------

interface EACIServerBase extends EACISchemaBaseI {}

interface EACIRestActionI extends EACIServerBase {
    method: string;
    path?: EmdlI[];
    headers?: EmdlI[];
    urlParams?: EmdlI[];
    requestBody?: EmdlI[];
}

interface EACISocketActionI extends EACIServerBase {
    eventName: string;
    path?: EmdlI[];
    headers?: EmdlI[];
    urlParams?: EmdlI[];
    requestBody?: EmdlI[];
}

// -------------------------------------------------------- SERVER END --------------------------------------------------------

// -------------------------------------------------------- MISC START --------------------------------------------------------

interface EACIMiscBase extends EACISchemaBaseI {}

interface EACIMiscRenderTemplateI extends EACISchemaBaseI {
    template: string;
    templateVars?: EmdlI[];
}

interface EACICommandI extends EACIMiscBase {
    isAsync?: boolean;
    rootFolder?: EmdlI[];
    command?: EmdlI[];
}

interface EACIServiceCallI extends EACIMiscBase {
    service: string;
    headers?: EmdlI[];
    urlParams?: EmdlI[];
    requestBody?: EmdlI[];
    actionListSource?: EmdlI[];
}

interface EACISuccessI extends EACIMiscBase {}

interface EACIErrorI extends EACIMiscBase {}

// -------------------------------------------------------- MISC END --------------------------------------------------------

type EACIDb = EACIDbCreateOneI | EACIDbDeleteOneI | EACIDbGetListI | EACIDbGetOneI | EACIDbUpdateOneI | EACIDbGetOneIAndUpdate | EACIDbCreateOneIfNotExistsI;
type AACIFiles = EACIFilesSaveI | EACIFilesDeleteI | EACIFilesReadI;
type AACILogic = EACILogicListI | EACIDataTransformerListI | EACILogicDoI | EACILogicWhenI;
type AACIEmail = EACISendSTMPEmailI;
type AACIServer = EACIRestActionI | EACISocketActionI;
type AACIMisc = EACICommandI | EACIServiceCallI | EACISuccessI | EACIErrorI | EACIMiscRenderTemplateI;

type E_ACTION_SCHEMA = EACIDb | AACIFiles | AACILogic | AACIEmail | AACIServer | AACIMisc;

export { idLength }

export interface ServiceEACII {
    id: string | number;
    name: string;
    description: string;
    successCode?: number;
    successMessage?: string;
    errorCode?: number;
    errorMessage?: string;
    isNew?: boolean;
    output?: any[];
    type: E_RETURN_TYPES;
    schema: E_ACTION_SCHEMA;
}

export interface ServiceI {
    id: string | number;
    filterId: string;
    name: string;
    description?: string;
    projectId: number;
    selected: boolean;
    serviceGroupId: number;
    type: E_SERVICE_TYPE;   
    actionInput: EmdlI[];
    output: EmdlI[];
    definition: ServiceDefinitionI;
    logic: ServiceEACII[];
}

export class MenuStateInner {
    private _menu: MenuItem[] = [];
    private _actionLog: LogI[] = [];
    private _alIndexDict: { [key: string]: number } = {};
    private _aiMenuitem: any = {};
    private _debug: boolean = false;
    private _debugInner: boolean = false;
    private _actionOutputs: any = {};

    public get debug() { return this._debug }
    public get debugInner() { return this._debugInner }
    public get menu() { return this._menu }
    public get actionLog() { return this._actionLog }
    public get actionOutputs() { return this._actionOutputs }

    private _nonDynTarget: string[] = [ 'state', 'stash', 'assignment', 'actions' ];

    constructor(ai: EmdlI[], dss: any, debug: boolean = false, debugInner: boolean = false) {
        this._debug = debug;
        this._debugInner = debugInner;

        if (Array.isArray(ai)) {
            for (const e of ai) {
                this._aiMenuitem[e.property] = {
                    groupId: 'eezze',
                    id: `action-input-${e.property}`,
                    type: e.type,
                    key: e.raw,
                    title: e.property,
                    // title: tr(`action-input-default`, { args: [e.property] }),
                    example: e?.example ?? '',
                };
            }
        }
    }

    public addActionLog(ali: LogI) {
        if (typeof ali.id == 'undefined') {
            console.log('undefined id: ', ali);
            process.exit();
        }

        if (typeof this._alIndexDict[ali.id] == 'number') {
            console.log('ID ALREADY EXISTSED ', ali.id);
            process.exit();
        }

        this._alIndexDict[ali.id] = this._actionLog.length;
        this._actionLog.push(ali);
    }

    public addMenuItem(mi: MenuItem) { this._menu.push(mi) }

    private getMenuLogItems(start: number, end: number) : LogI[]{
        if (end > (this._actionLog.length - 1)) {
            throw `index exceeded the amount of items in the menu "${this._actionLog.length} : ${end}"`;
        }

        return this._actionLog.slice(start, end);
    }

    public filterMenu(genId?: string) : any {
        if (genId && typeof this._alIndexDict[genId] != 'number') {
            console.log(`There was no menu item with the given genId "${genId}"`);
            return [];
        }

        if (!genId) {
            const keys = Object.keys(this._alIndexDict);
            genId = `${this._alIndexDict[keys[keys.length - 1]]}`;
        }

        const alogs = this.getMenuLogItems(0, this._alIndexDict[genId]);

        // 'accessed-from-browser': {
        //     groupId: 'eezze',
        //     id: 'accessed-from-browser',
        //     type: 'boolean',
        //     key: 'adm.request.accessedFromBrowser',
        //     title: tr('accessed-from-browser'),
        //     example: true,
        // },

        const out = {
            eezze: {
                actionInput: {
                    groupId: 'eezze',
                    id: 'action-input',
                    title: tr('action-input'),
                    children: this._aiMenuitem,
                },
                state: {
                    groupId: 'eezze',
                    id: 'state',
                    title: tr('state'),
                    children: {},
                },
                stash: {
                    groupId: 'eezze',
                    id: 'stash',
                    title: tr('stash'),
                    children: {},
                },
                assignment: {
                    groupId: 'eezze',
                    id: 'assignments',
                    title: tr('assignments'),
                    children: {},
                },
            },
            actions: {
                // 'action-1': {
                //     groupId: 'actions',
                //     id: 'action-1',
                //     title: 'Action 1',
                //     children: {},
                // },
            }
        } as any;

        // here i recreate the state of the menu based on the action log ledger
        if (alogs.length > 0) {
            for (const li of alogs) {
                if (li.action == 'action-output') {
                    out.actions[li.key] = this._actionOutputs[`action-${li.key}`];
                    continue;
                }

                if (li.target) {
                    if (li.state == 'invalid') {
                        // this is where we delete the state of any variable out of the action log if the state is invalid
                        if (typeof out.eezze?.[li.target]?.children?.[li.key] != 'undefined') {
                            delete out.eezze?.[li.target]?.children?.[li.key];
                        }
                    }
                    else {
                        if (!out.eezze[li.target]) {
                            out.eezze[li.target] = {
                                groupId: 'eezze',
                                id: li.target,
                                title: tr(li.target),
                                children: {},
                            };
                        }

                        if (!this._nonDynTarget.includes(li.target)) {
                            if (li?.lcPropState == 'closed') {
                                delete out.eezze[li.target].children[li.key];

                                // this is done because the place where we close the state we should essentially invalidate the 
                                // states of each of the assignments with an action log ledger entry but this is proving to be 
                                // a huge pain in the ass so this is the solution i've come up with for now.
                                out.eezze.assignment.children = {};
                            }
                            else {
                                out.eezze[li.target].children[li.key] = {
                                    groupId: 'eezze',
                                    id: `${li.id}`,
                                    type: li.type,
                                    key: `lc.prop('${li.key}')`,
                                    title: `${li.target}->${li.key}`,
                                    example: '',
                                };
                            }
                        }
                        else {
                            out.eezze[li.target].children[li.key] = {
                                groupId: 'eezze',
                                id: `${li.id}`,
                                type: li.type,
                                key: `lc.prop('${li.key}')`,
                                title: li.key,
                                example: '',
                            };
                        }
                    }
                }
                else {
                    // console.log('filtered menu ELSE: ', li);
                }
            }
        }

        return {
            eezze: Object.values(out.eezze),
            actions: Object.values(out.actions),
        };
    }
}

export default class MenuState {
    private _serv: ServiceI;

    private _menu: any = [];
    private _menuState: MenuStateInner;

    private _debug: boolean = false;
    private _debugInner: boolean = false;

    public get debugInner() { return this._debugInner }
    public get menu() { return this._menu }

    private _typesDict: any = {
        'action-input': {
            title: tr('action-input'),
            color: randDarkColor(),
        }, 
        state: {
            title: tr('state'),
            color: randDarkColor(),
        }, 
        stash: {
            title: tr('stash'),
            color: randDarkColor(),
        }, 
        assignments: {
            title: tr('assignment'),
            color: randDarkColor(),
        }
    };

    constructor(service: ServiceI, dss: any, debug: boolean = false, debugInner: boolean = false) {
        this._debug = debug;
        this._serv = service;
        this._debugInner = debugInner;

        this._menuState = new MenuStateInner(
            service?.actionInput ?? [],
            dss,
            this._debug,
            debugInner
        );

        // not sure if this should be here. this might cause issues in the future
        // this.refresh();
    }

    private processActionChainItem(aci: ServiceEACII) {
        const sc: E_ACTION_SCHEMA = aci.schema, 
              act = sc._action;

        if (this._debug) startAC(aci);

        const out: any = [];

        switch (act.category) {
            case 'database': {
                switch (act.action) {
                    case 'get-one': ActionDatabase.getOne(aci, this._menuState, out); break;
                    case 'create-one': ActionDatabase.createOne(aci, this._menuState, out); break;
                    case 'replace-one': ActionDatabase.replaceOne(aci, this._menuState, out); break;
                    case 'update-one': ActionDatabase.updateOne(aci, this._menuState, out); break;
                    case 'delete-one': ActionDatabase.deleteOne(aci, this._menuState, out); break;
                    case 'get-list': ActionDatabase.getList(aci, this._menuState, out); break;
                    case 'create-one-if-not-exists': ActionDatabase.createIfNotExists(aci, this._menuState, out); break;
                    case 'get-one-and-update': ActionDatabase.getOneAndUpdate(aci, this._menuState, out); break;
                }
                break;
            }
            case 'files': {
                switch (act.action) {
                    case 'save': ActionFiles.save(aci, this._menuState, out); break;
                    case 'read': ActionFiles.read(aci, this._menuState, out); break;
                    case 'delete': ActionFiles.delete(aci, this._menuState, out); break;
                }
                break;
            }
            case 'logic': {
                switch (act.action) {
                    case 'list': ActionLogic.list(aci, this._menuState, out); break;
                    case 'data-transformer': ActionLogic.dataTransformer(aci, this._menuState, out); break;
                    case 'do': ActionLogic.do(aci, this._menuState, out); break;
                    case 'when': ActionLogic.when(aci, this._menuState, out); break;
                }
                break;
            }
            case 'email': {
                switch (act.action) {
                    case 'send-smtp-email': ActionEmail.sendSmtpEmail(aci, this._menuState, out); break;
                }
                break;
            }
            case 'server': {
                switch (act.action) {
                    case 'rest-action': ActionServer.restAction(aci, this._menuState, out); break;
                    case 'socket-action': ActionServer.socketAction(aci, this._menuState, out); break;
                }
                break;
            }
            case 'response': {
                switch (act.action) {
                    case 'redirect': ActionResponse.redirect(aci, this._menuState, out); break;
                }
                break;
            }
            case 'misc': {
                switch (act.action) {
                    case 'render-template': ActionMisc.renderTemplate(aci, this._menuState, out); break;
                    case 'command': ActionMisc.command(aci, this._menuState, out); break;
                    case 'service-caller': ActionMisc.serviceCaller(aci, this._menuState, out); break;
                    case 'success': ActionMisc.success(aci, this._menuState, out); break;
                    case 'error': ActionMisc.error(aci, this._menuState, out); break;
                }
                break;
            }
            default: {
                console.log('Not sure what to do here: ',  aci);
            }
        }

        // if (this._debug) subInd();

        return out;
    }

    private getActionReturnMdl(type: string, lcs: EmdlI[]) {
        const singleItemTypes: string[] = [
            'list', 'text', 'number', 'boolean', 'date',
        ];

        if (singleItemTypes.includes(type)) {
            return lcs.length > 0 ? lcs[0] : [];
        }

        return lcs;
    }

    public menuizeService() {
        const s = this._serv;

        if (this._debug) {
            startService(s);
            addInd('menuizeService->startService');
        }

        // loop over each decorator / action in the action chain
        if (Array.isArray(s?.logic)) {
            for (const act of s.logic) {
                this._menuState.addActionLog({
                    id: `${act.id}-dec-process-open`,
                    lcItemState: 'open',
                    action: 'open-decorator-processing',
                    key: `${act.id}`,
                    type: act.type,
                    subtype: act.type,
                });

                // process the action condition first as this is the first thing evaluated
                if (typeof s?.definition?.condition != 'undefined') {
                    this._menuState.addActionLog({
                        id: `${act.id}`,
                        lcItemState: 'open',
                        action: 'open-condition-logic-chain',
                        key: `${act.id}`,
                        type: act.type,
                        subtype: act.type,
                    });

                    const lc = new LogicChain(this._menuState);

                    lc.processLc('', s?.definition?.condition);

                    this._menuState.addActionLog({
                        id: `close-${act.id}`,
                        lcItemState: 'closed',
                        action: 'close-condition-logic-chain',
                        key: `${act.id}`,
                        type: act.type,
                        subtype: act.type,
                    });
                }

                // first we need to run the action condition as this is the first thing at the 
                // top of the action in the decorators that is processed
                const props = this.processActionChainItem(act);

                let index = 0;

                for (const pr of props) {
                    const isProp = pr.mappingType == 'prop';

                    if (this._debug) {
                        addInd('menuizeService->startPropLc');
                        startPropLc(pr);
                    }

                    this._menuState.addActionLog({
                        id: `${act.id}-${pr.prop}-lc-open`,
                        lcItemState: 'open',
                        action: 'open-logic-chain',
                        key: pr.id,
                        type: pr.type,  
                        subtype: pr.returns,
                    });

                    if (this._debug) {
                        addInd('menuizeService->arrayMappingStart');

                        info(`${indentation}------ "${pr.prop}" -> LOGIC CHAIN FOR PROP ${isProp ? 'ARRAY' : 'OBJECT'} ------\n|`);
                    }

                    const lc = new LogicChain(this._menuState);

                    lc.processLc(pr.prop, pr.value);

                    if (pr.prop == 'output' && Array.isArray(pr.value) && pr.value.length > 0) {
                        const acId = `action-${act.id}`;

                        const action: any = {
                            groupId: 'actions',
                            id: act.id,
                            title: act.name,
                            children: {
                                result: {
                                    groupId: 'actions',
                                    id: 'result',
                                    title: tr('result'),
                                    type: 'object',
                                    children: {},
                                }
                            }
                        }

                        const outputMdl = this.getActionReturnMdl(act?.type, pr.value);

                        if (Array.isArray(outputMdl)) {
                            for (const p of outputMdl) {
                                action.children.result[p.id] = {
                                    groupId: 'actions',
                                    id: pr?.id,
                                    actionIndex: index,
                                    type: pr?.type,
                                    key: `adm.action(${index}).result[${p.property}]`,
                                    title: tr(`action-title`, { args: [p.property] }),
                                    example: pr?.example,
                                };
                            }
                        }
                        else {
                            action.children.result.children[outputMdl.id] = {
                                groupId: 'actions',
                                id: outputMdl?.id,
                                actionIndex: index,
                                type: act.type,
                                key: `adm.action(${index}).result`,
                                title: tr(`action-title`, { args: [ 'na' ] }),
                                example: pr?.example,
                            };
                        }

                        this._menuState.actionOutputs[acId] = action;

                        this._menuState.addActionLog({
                            id: `${act.id}-output`,
                            state: 'active',
                            action: 'action-output',
                            key: `${act.id}`,
                            type: pr.type,
                            subtype: pr.returns,
                        });
                    }

                    this._menuState.addActionLog({
                        id: `${act.id}-${pr.prop}-lc-closed`,
                        lcItemState: 'closed',
                        action: 'close-logic-chain',
                        key: `${act.id}`,
                        type: pr.mappingType,
                        subtype: pr.mappingType,
                    });

                    if (this._debug) {
                        danger(`\n|${indentation}------ "${pr.prop}" -> LOGIC CHAIN FOR ${isProp ? 'ARRAY' : 'OBJECT'} END ------`);
                        subInd();

                        danger(`\n|${indentation}------ PROP LC END ------`);
                        subInd();
                    }

                    index++;
                }

                this._menuState.addActionLog({
                    id: `${act.id}-dec-process-close`,
                    lcItemState: 'open',
                    action: 'close-decorator-processing',
                    key: `${act.id}`,
                    type: act.type,
                    subtype: act.type,
                });
            }
        }

        if (this._debug) subInd();
    }

    public refresh() {
        try {
            this.menuizeService();
        }
        catch (err) {
            // console.clear();
            // console.log('Refresh menu error: ', err);
        }
    }

    public output(elId?: string) {
        this.refresh();

        return this._menuState.filterMenu(elId);
    }

    public parFIlterMenu(search: string = '', filter: string) {
        const menu: any = this._menuState.filterMenu(filter);

        const out: any[] = [];
console.log('                     ');
console.log('                     ');
console.log('                     ');
console.log('                     ');
console.log('                     ');
console.log('                     ');
console.log(menu.eezze[0]);
console.log('              ');
console.log('              ');
        let ge: any;

        // keys we care about
        const kwca = [ 
            'action-input', 'state', 'stash', 'assignments',
        ];

        // loop over the menu group first
        for (ge of Object.values(menu.eezze)) {
            let i: any;

            // then we loop over each of the items in that group
            for (i of Object.values(ge.children)) {
                let di: any = {};

                if (kwca.includes(ge.id)) {
                    di = this._typesDict[ge.id];

                    di.isrc = 'from1';
                }
                else {
                    if (typeof this._typesDict[ge.id] == 'undefined') {
                        this._typesDict[ge.id] = {
                            title: tr('action-input'),
                            color: randDarkColor(),
                        };
                    }

                    di.isrc = 'from2';
                }
console.log('YEAH: ', i);
                out.push({
                    key: i.key,
                    raw: i.raw,
                    src: ge.id,
                    title: di?.title,
                    color: di?.color,
                    isrc: di.isrc,
                });
            }
        }
console.log('out: ', out);
        return out;
    }
}