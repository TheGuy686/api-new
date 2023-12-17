// import { generateRandomString } from '../StringMethods';
import { LogI, MenuStateInner, ServiceI, idLength } from './MenuState';
import { 
    danger, 
    dealocAssignment, 
    indent, 
    indexSize, 
    info, 
    loopClose, 
    loopOpen, 
    prEnd, 
    prInfo, 
    prStart,
    indentation,
    addInd,
    subInd,
    solog,
    startPropLcMapping
} from './StateLogger';

const color = require('colorts').default;

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

export default class LogicChain {
    private _state: MenuStateInner;

    private _debug: boolean = false;
    private _debugInner: boolean = false;

    private _isProcesscingLc: boolean = false;
    private _isProcessingLcItem: boolean = false;

    constructor(state: MenuStateInner, debug: boolean = false) {
        this._debug = debug;
        this._state = state;

        this._debugInner = state.debugInner;
    }

    private processCustomBlock(lci: any) {
        if (this._debugInner){
            const infoInd = indentation + indent(indexSize);

            const infs = [
                `\n|${infoInd}id: #${lci.id}`,
                `\n|${infoInd}name: #${lci.name}`,
                `\n|${infoInd}returns: ${color((lci.returns ?? '').toUpperCase()).white.str}`,
            ]

            prStart(
                `${indentation}--- CUSTOM CODE BLOCK ---\n|${infs.join('')}`
            );
        }
    }

    private prStateStash(assigns: any[], isState: boolean) {
        // loop over all the assignments and pass those assignments to the state manager
        if (Array.isArray(assigns)) {
            const target = isState ? 'state' : 'stash';

            if (this._debugInner) {
                prStart(`${indentation}--- ${target.toUpperCase()} VALUES START ---`);
            }

            const asiLogs: any[] = [];

            for (const pr of assigns) {
                // const _gid: string = generateRandomString(idLength);
                const _gid: string = pr.filterId;

                const key = pr.logic.prop,
                      type = pr.returns,
                      subtype = pr.type == 'custom' ? 'custom' : pr.logic.subtype;

                this._state.addMenuItem({
                    group: target,
                    _gid: _gid,
                    id: pr.id,
                    type: type,
                    subtype: subtype,
                    key: key,
                    title: pr.logic.prop,
                    example: pr.logic.example,
                });

                this._state.addActionLog({
                    id: _gid,
                    state: 'active',
                    target: target,
                    action: `set-${target}`,
                    key: key,
                    type: type,
                    subtype: subtype,
                });

                if (this._debugInner) {
                    asiLogs.push(`${indentation}${indent(indexSize)} -- ${pr.logic.prop}: ${color(type.toUpperCase()).white.str}`);
                }
            }

            if (this._debugInner) {
                prInfo(asiLogs.join('\n|') + '\n');

                prEnd(indentation + `--- ${target.toUpperCase()} VALUES END ---`);
            }
        }
    }

    private prInvalidateAssignments(assignments: LogI[]) {
        if (Array.isArray(assignments) && assignments.length > 0) {
            if (this._debugInner) {
                danger('\n');
                danger(`${indentation}--- UNASSIGNING PROPS ---`);
            }

            for (const asi of assignments) {
                asi.id = `${asi.id}-unass`;
                asi.action = 'destroy-assignment';
                asi.state = 'invalid';

                this._state.addActionLog({...asi});

                if (this._debugInner) {
                    dealocAssignment(asi);
                }
            }
        }
    }

    private prAssignments(assigns: any[], assignments: LogI[], isPrimitive: boolean = false) {
        // loop over all the assignments and pass those assignments to the state manager
        if (Array.isArray(assigns)) {

            if (this._debugInner) {
                prStart(indentation + '--- ASSIGN VALUES START ---');
            }

            const asiLogs: any[] = [];

            for (const pr of assigns) {
                // const _gid: string = generateRandomString(idLength);
                const _gid: string = pr.filterId;

                const key = pr.logic.prop,
                      type = pr.returns,
                      subtype = pr.logic.subtype,
                      action = isPrimitive ? 'assign-primitive' : 'assign-var';

                this._state.addMenuItem({
                    group: 'assign',
                    _gid: _gid,
                    id: pr.id,
                    type: type,
                    subtype: subtype,
                    key: key,
                    title: pr.logic.prop,
                    example: pr.logic.example,
                });

                const li: LogI = {
                    id: _gid,
                    state: 'active',
                    target: 'assignment',
                    action: action,
                    key: key,
                    type: type,
                    subtype: subtype,
                };

                this._state.addActionLog(li);
                assignments.push({...li});

                asiLogs.push(`${indentation}${indent(indexSize)} -- ${pr.logic.prop}: ${color(type.toUpperCase()).white.str}`);
            }

            if (this._debugInner) {
                prInfo(asiLogs.join('\n|') + '\n|');

                prEnd(indentation + '--- ASSIGN VALUES END ---');
            }
        }
    }

    private prFormatter(lci: any) {
        if (this._debugInner){
            const infoInd = indentation + indent(indexSize);

            const infs = [
                `\n|${infoInd}id: #${lci.id}`,
                `\n|${infoInd}name: #${lci.name}`,
                `\n|${infoInd}returns: ${color((lci.returns ?? '').toUpperCase()).white.str}`,
            ]

            prStart(
                `${indentation}--- FORMATTER ---\n|${infs.join('')}`
            );
        }

        this._state.addActionLog({
            // id: generateRandomString(idLength),
            id: lci?.id,
            action: `formatter${lci?.logic?.subtype ? `-${lci?.logic?.subtype}` : ''}`,
            key: `${lci.id}`,
            type: lci.returns,
            // metadata: JSON.stringify({
            //     listSource: ls,
            //     ilcActions: acs.length,
            // }, null, 4),
        });
    }

    private prNumericOperation(lci: any) {
        if (this._debugInner){
            const infoInd = indentation + indent(indexSize);

            const infs = [
                `\n|${infoInd}id: #${lci.id}`,
                `\n|${infoInd}name: #${lci.name}`,
                `\n|${infoInd}returns: ${color((lci.returns ?? '').toUpperCase()).white.str}`,
            ]

            prStart(
                `${indentation}--- NUMBER OPERATION ---\n|${infs.join('')}`
            );
        }

        this._state.addActionLog({
            // id: generateRandomString(idLength),
            id: lci.id,
            action: 'number-operation',
            key: `${lci.id}`,
            type: lci.returns,
            // metadata: JSON.stringify({
            //     listSource: ls,
            //     ilcActions: acs.length,
            // }, null, 4),
        });
    }

    public printMenuState(genId: string) {
        const state = this._state.filterMenu(genId);

        const steValue: any[] = Object.values(state?.eezze?.state?.children ?? []);
        const staValue: any[] = Object.values(state?.eezze?.stash?.children ?? []);
        const asiValue: any[] = Object.values(state?.eezze?.assignment?.children ?? []);

        const logs: string[] = [ '    ' ];

        if (this._debugInner) {
            logs.push(`${indentation}--- SCOPED STATE VALUES ---\n|`);
        }

        if (steValue.length > 0 && this._debugInner) {
            for (const p of steValue) {
                logs.push(`${indentation}  - ${p.title}: ${color(p.type.toUpperCase()).white.str}`);
            }

            logs.push(`   `);
        }
        else {
            logs.push(`${indentation}  - NO STATE VARS AVAILABLE`);
            logs.push(`   `);
        }

        if (this._debugInner) {
            logs.push(`${indentation}--- SCOPED STASH VALUES ---\n|`);
        }

        if (staValue.length > 0 && this._debugInner) {
            for (const p of staValue) {
                logs.push(`${indentation}  - ${p.title}: ${color(p.type.toUpperCase()).white.str}`);
            }

            logs.push(`  `);
        }
        else {
            logs.push(`${indentation}  - NO STASH VARS AVAILABLE`);
            logs.push(`   `);
        }

        if (this._debugInner) {
            logs.push(`${indentation}--- SCOPED ASSIGNED VALUES ---\n|`);
        }

        if (asiValue.length > 0 && this._debugInner) {
            for (const p of asiValue) {
                logs.push(`${indentation}  - ${p.title}: ${color(p.type.toUpperCase()).white.str}`);
            }
        }
        else {
            logs.push(`${indentation}  - NO ASSIGNMENTS VARS AVAILABLE`);
            logs.push(`   `);
        }

        if (logs.length > 0 && this._debugInner) info(logs.join('\n|') + '\n|');
    }

    // This essentailly just loops over all the inner logic chain items
    private processChain(property: string, chAcs: any[], assignmentsM: LogI[] = [], isInnerLoop: boolean = false) {
        // then loop over each action
        for (const act of chAcs) {
            const acts: any[] = act?.actions ?? [];

            if (this._state.debug && !this._isProcesscingLc) {
                addInd('processChain->startInnerChain');
                info(`\n|${indentation}----- INNER LCI START #${act.id} "${act.name}" -----`);
                this._isProcesscingLc = true;
            }

            let loopOpened = false;

            const lcItemEventYpes: string[] = [
                'set-state-values',
                'set-stash-values',
                'assign-primitive',
                'assign-values',
                'list-process',
                'number-operation',
                'formatter',
                'custom',
            ];

            switch (act?.type) {
                case 'set-state-values': {
                    if (act.actions.length > 0) {
                        this.prStateStash(act.actions, true);
                    }
                    break;
                }
                case 'set-stash-values': {
                    if (act.actions.length > 0) {
                        this.prStateStash(act.actions, false);
                    }
                    break;
                }
                case 'assign-values': {
                    if (act.actions.length > 0) {
                        this.prAssignments(act.actions, assignmentsM);
                    }
                    break;
                }
                case 'list-process': {
                    const acs = (act?.actions ?? []);

                    // const _gid = generateRandomString(idLength);
                    const _gid = act.filterId;

                    if (this._debugInner){
                        const infoInd = indentation + indent(indexSize);
                        const ls = act?.logic?.raw ?? 'not-set';

                        const infs = [
                            `\n|${infoInd}id: #${act.id}`,
                            `\n|${infoInd}listSource: ${ls}`,
                            `\n|${infoInd}actions: ${acs.length} actions`,
                        ];

                        loopOpen(
                            `${indentation}--- LOOP START ---\n|${infs.join('')}`
                        );
                    }

                    this._state.addActionLog({
                        id: _gid,
                        state: 'active',
                        action: `opened-list-process`,
                        key: `${act.id}`,
                        type: act.returns,
                        // metadata: JSON.stringify({
                        //     listSource: ls,
                        //     ilcActions: acs.length,
                        // }, null, 4),
                    });

                    loopOpened = true;

                    if (this._debugInner) {
                        addInd('processChain->openLoop');
                        this.printMenuState(_gid);
                    }

                    break;
                }
                case 'number-operation': {
                    this.prNumericOperation(act);
                    break;
                }
                case 'formatter': {
                    this.prFormatter(act);
                    break;
                }
                case 'custom': {
                    this.processCustomBlock(act);
                    break;
                }
                default: {
                    if (!lcItemEventYpes.includes(act.type)) {
                        if (this._isProcessingLcItem) {
                            this._isProcessingLcItem = false;

                            solog(`\n|${indentation}------ LOGIC CHAIN ITEM END ------\n|`);

                            subInd();
                        }

                        if (this._debug) {
                            addInd('processChain->logicChainIttemStart');

                            solog(`${indentation}------ LOGIC CHAIN ITEM START ------\n`);
                            
                            this._isProcessingLcItem = true;
                        }
                    }
                }
            }

            if (acts.length > 0) {
                const assignments: LogI[] = [];
                
                if (this._debugInner) addInd('processChain->ilcActionsStart');

                this.processChain('', acts, assignments, true);

                if (this._debugInner) subInd();

                if (loopOpened) {
                    this.prInvalidateAssignments(assignments);

                    if (this._debugInner) {
                        loopClose();
                        subInd();
                    }

                    this._state.addActionLog({
                        // id: generateRandomString(idLength),
                        id: `${act.id}-close`,
                        state: 'active',
                        action: `closed-list-process`,
                        key: `${act.id}`,
                        type: act.returns,
                        // metadata: JSON.stringify({
                        //     listSource: ls,
                        //     ilcActions: acs.length,
                        // }, null, 4),
                    });
                }
            }

            if (this._state.debug && this._isProcesscingLc && !isInnerLoop) {
                danger(`\n|${indentation}----- INNER LOGIC CHAIN ITEM END -----`);
                subInd();
                this._isProcesscingLc = false;
            }
        }
    }

    private recProcessChain(property: string, lc: any, isTopLevel: boolean = true) {
        // first loop over each property logic chain. For e.g: input->email = list of logic chains
        if (Array.isArray(lc)) {
            let i: any;

            for (i in lc) {
                const c: any = lc[i];

                this._state.addActionLog({
                    id: c.filterId,
                    lcPropState: 'open',
                    action: `object-prop-lc-start`,
                    key: `${c.property}`,
                    type: c.type,
                    target: property,
                    property: c.property,
                });

                if (c?.baseType == 'logic-chain') {
                    if (this._debugInner) {
                        addInd('recProcessChain->lcPropItemStart');
                        startPropLcMapping(c);
                    }

                    const assignments: LogI[] = [];

                    this.processChain(property, c.actions, assignments);

                    if (this._debugInner) {
                        danger(`\n|${indentation}-------- CLOSED LC PROP ITEM --------------\n|`);
                        subInd();
                    }
                }
                else if (c?.baseType == 'context-mapping') {
                    console.log('Context Mapping:  ', c);
                }
                else {
                    console.log('Else static: ', c);
                }

                this.printMenuState(c.filterId);

                this._state.addActionLog({
                    id: c.filterId + '-close',
                    lcPropState: 'closed',
                    action: `object-prop-lc-end`,
                    key: `${c.id}`,
                    type: c.type,
                    target: 'input',
                    property: c.property,
                });
            }
        }
        else if (typeof lc == 'object' && lc?.baseType == 'logic-chain') {
            this.processChain('', lc.actions);
        }
        else {
            // console.log('Now something else: ', lc);
        }
    }

    public processLc(property: string, lc: any) {
        this.recProcessChain(property, lc);
    }
}