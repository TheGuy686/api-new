import { LogI, ServiceEACII, ServiceI } from './MenuState';

const color = require('colorts').default;
const indexSize = 3;

let indentation = '';

export {
    indexSize,
    indentation,
}

export function addInd(src: string) {
    // console.log(`${indentation}Indented from "${src}"`);
    
    indentation += indent(indexSize);
}

export function subInd() {
    indentation = indentation.substring(0, (indentation.length - indexSize));
}

export function indent(depth: number) {
    let str = '', i = 0;

    while (i < depth) {
        str += ' ';
        i++;
    }

    return str;
}

export function loopOpen(...args: any[]) {
    console.log.apply(console.log, Object.values(args).map((a: any) => {
        if (typeof a == 'object') return color('|').white.str + color('|\n').white.str + color(JSON.stringify('\n|' + a, null, 4)).yellow.str;

        return color('|').white.str + color('\n|' + a).yellow.str;
    }));
}

export function label(str: string) {
    console.log(color(`\n|\n|${indentation}${str}\n|`).white.str);
}

export function startService(ser: ServiceI) {
    const types = {
        rest: 'RESTFUL',
        websocket: 'WEBSOCKET',
        cron: 'CRON TASK'
    };

    const isRest = ser?.type == 'rest';

    const mds = `
______________________________________________________________________________________________________________
|                                                                                                               
|                        STARTING MENU PROCESSING FOR #${ser.id} - ${ser.name}                                   
|                                                                                                                 
|                             "${ser.description}"                                                                 
|                                                                                                                  
|                             Type: ${color(types?.[ser?.type]).yellow.str}                                         
|                             ${isRest ? 'METHOD' : 'Event:'} "${(color(isRest ? (ser.definition?.method ?? '').toUpperCase() + ' /' + ser.definition?.path ?? '' : ser.definition?.eventName).blue.str)}"
|                             Roles: ${(ser?.definition?.roles ?? []).join(', ')} 
|                                                                                                                    
|______________________________________________________________________________________________________________
    `;

    console.log(color(mds).white.str);
}

export function startAC(aci: ServiceEACII) {
    const msg = [
        `${indentation}____________________________________________________________________________________________________________________________`,
        `${indentation}|                  Action Chain Item #${aci.id} - ${aci.name} "${color((aci.type ?? '').toUpperCase()).bgWhite.black.str}"`,
        `${indentation}|                                     "${aci.description}"`,
        `${indentation}|____________________________________________________________________________________________________________________________`,

    ];

    console.log(color(msg.join('\n')).white.str);
}

export function startPropLc(prop: any) {
    const msg = [
        `${indentation}__________________________________________________________________________________________________`,
        `${indentation}|                 MAIN Prop Logic Chain #${prop.prop} "${prop.mappingType}" returns "${prop.returns}"`,
        `${indentation}|_________________________________________________________________________________________________\n|`,

    ];

    console.log(color(msg.join('\n')).yellow.str);
}

export function startPropLcMapping(propItem: any) {
    const msg = [
        `|${indentation}------ Prop Logic Chain "${color(propItem?.property).white.str}" #${propItem.name} returns "${propItem.type}" ------`,
    ];

    console.log(color(msg.join('\n')).blue.str);
}

export function loopClose() {
    console.log(color('|\n|' + indentation.substring(0, indentation.length - (indexSize)) + '--- FOOR LOOP END ---- \n|').yellow.str);
}

export function prStart(...args: any[]) {
    console.log.apply(console.log, Object.values(args).map((a: any) => {
        if (typeof a == 'object') return color(JSON.stringify('\n|' + a, null, 4)).cyan.str;

        return color('|').white.str + color('\n|' + a).cyan.str;
    }));
}

export function prInfo(...args: any[]) {
    console.log.apply(console.log, Object.values(args).map((a: any) => {
        if (typeof a == 'object') return color(JSON.stringify('\n|' + a, null, 4)).white.str;

        return color('|').white.str + color('\n|' + a).white.str;
    }));
}

export function dealocAssignment(li: LogI) {
    danger(`${indentation}${indent(indexSize)} prop: ${li.key}`);
}

export function prEnd(...args: any[]) {
    console.log.apply(console.log, Object.values(args).map((a: any) => {
        if (typeof a == 'object') return color(JSON.stringify('|' + a, null, 4)).red.str;

        return color('|' + a).red.str;
    }));
}

export function success(...args: any[]) {
    console.log.apply(console.log, Object.values(args).map((a: any) => {
        if (typeof a == 'object') return color(JSON.stringify('|' + a, null, 4)).green.str;

        return color('|' + a).green.str;
    }));
}

export function solog(...args: any[]) {
    console.log.apply(console.log, Object.values(args).map((a: any) => {
        if (typeof a == 'object') return color(JSON.stringify('|' + a, null, 4)).bold.yellow.str;

        return color('|' + a).bold.yellow.str;
    }));
}



export function info(...args: any[]) {
    console.log.apply(console.log, args.map((a: any) => {
        if (typeof a == 'object') return color('|' + JSON.stringify(a, null, 4)).blue.str;

        return color('|' + a).blue.str;
    }));
}

export function warn(...args: any[]) {
    console.log.apply(console.log, args.map((a: any) => {
        if (typeof a == 'object') return color('|' + JSON.stringify(a, null, 4)).yellow.str;

        return color('|' + a).yellow.str;
    }));
}

export function danger(...args: any[]) {
    console.log.apply(console.log, args.map((a: any) => {
        if (typeof a == 'object') return color(JSON.stringify('|' + a, null, 4)).red.str;

        return color('|' + a).red.str;
    }));
}