export function keyify (dataset: any, key: string | number, keyTransformer?: Function) {
    const out: any = {};

    for (const i in dataset)
    {
        if (typeof dataset[i][key] == 'undefined')
        {
            console.warn(
                `Key: ${key} was not defined in ${JSON.stringify(
                    dataset[i],
                    null,
                    4,
                )}. Therefore was skipped and not included in the keyified array`,
            );

            continue;
        }

        out[keyTransformer ? keyTransformer(dataset[i][key]) : dataset[i][key]] = dataset[i];
    }

    return out;
};

export function arrayDiff(arr1: any[], arr2: any[]) {
    if (!arr1 || !arr2) return [];

    if (!Array.isArray(arr1)) {
        throw new Error(`\n\nArrayMethods:arrayDiff: arr1 was not an array. Got: ${arr1}\n`);
    }

    if (!Array.isArray(arr2)) {
        throw new Error(`\n\nArrayMethods:arrayDiff: arr2 was not an array. Got: ${arr2}\n`);
    }

    return arr1.filter(x => !arr2.includes(x));
}

export function arraySames(arr1: any[] | any, arr2: any[]) {
    if (!arr1 || !arr2) return [];

    if (!Array.isArray(arr1)) {
        throw new Error(`\n\nArrayMethods:arrayDiff: arr1 was not an array. Got: ${arr1}\n`);
    }

    if (!Array.isArray(arr2)) {
        throw new Error(`\n\nArrayMethods:arrayDiff: arr2 was not an array. Got: ${arr2}\n`);
    }

    return arr1.filter(x => arr2.includes(x));
}

export function objectSames(obj1: any, obj2: any) {
    if (!obj1 || !obj2) return [];

    const obj2Keys = Object.keys(obj2);

    return Object.keys(obj1).filter((k: string) => {
        if (!obj2Keys.includes(k)) return false;

        return obj1[k] == obj2[k];
    });
}

export function keyifyKeyPairs (dataset: any, key: string | number, keyTransformer?: Function) {
    const out: any = {};

    // loop on the main loop
    for (const pair of dataset) {
        let keyOut = '';
        // then loop on the inner key pair
        for (const i of pair) {
            const isFirstRun = keyOut == '';

            if (typeof i[key] == 'undefined') {
                console.warn(
                    `Key: ${key} was not defined in ${JSON.stringify(
                        pair[i],
                        null,
                        4,
                    )}. Therefore was skipped and not included in the keyifyKeyPairs array`,
                );

                continue;
            }

            keyOut += i[key];

            if (!isFirstRun) keyOut += '-';
        }

        out[keyOut] = pair;
    }

    console.log('keyified out; ', out);

    return out;
};

export function pj(obj: any) {
    try {
        return JSON.stringify(obj, null, 4);
    }
    catch (e) {
        console.log('PRETTY JSON: ', e.error);

        return JSON.stringify({
            error: {
                message: 'There was an error stringifying: ' + String(obj),
                inernal: e.message
            },
        }, null, 4)
    }
}