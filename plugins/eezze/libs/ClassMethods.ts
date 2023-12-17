
export function getClassNameFromObjString(obj: any) {
    try {
        const str = obj.toString();

        const matches = str.match(/class ([a-zA-Z0-1_]+)/);

        return matches[1];
    }
    catch (e) {
        try {
            return obj.constructor.name;
        }
        catch (e) {
            console.log(`Could not get the class name from obj: `, obj, e.message);

            throw new Error(`Can't get class name for: ${JSON.stringify(obj)}`);
        }
    }
}