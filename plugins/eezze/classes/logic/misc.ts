
export function insertArgsToStr(str: string, variables: object) {
    const vars = Object.values(variables ?? {});

    let out = `${str}`;

    if (vars && vars.length > 0) {
        for (const i in vars) {
            out = out.replace(`\${${Number(i) + 1}}`, vars[i]);
        }
    }

    return out;
}

/**
 *
 * @param source
 * @param key
 * @param value
 */
export function ESet(source: any, key: string | number, value: any) {
    if (typeof source != 'object') throw new Error(`ESet.source must be an object. Got "${typeof source}->${key}"`);
    source[key] = value;
}

/**
 *
 * @param source
 * @param key
 * @param value
 */
export function EDel(source: any, key: string | number) {
    if (typeof source != 'object') throw new Error(`EDel.source must be an object`);
    delete source[source];
    return source;
}

/**
 * Self contained code runner.
 *
 * @param sourceCode string containing custom source code.
 *
 * @returns sourceCode output
 */
export function ECustom(sourceCode: string): any {
    return new Function(sourceCode)();
}

/**
 * For each source element, it applies the actions in the cb.
 *
 * @param source Source array over which you want to perform the loop.
 * @param cb action functions for each of the source elements, making available the element and the index.
 *
 * @returns result array of the individual source element results.
 */
export function EList(source: any[], cb: Function): any {
    for (let indexSource = 0; indexSource < source.length; indexSource++) {
        const sourceElement = source[indexSource];

        cb(sourceElement, indexSource);
    }
}