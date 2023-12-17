import { insertArgsToStr } from "./misc";

export default class EText {
    static assign(value1: any, value2: any): string {
        return (value1 + value2) as string;
    }

    static format(str: string, variables: any) {
        try {
           return insertArgsToStr(str, variables);
        }
        catch (err) {
            throw new Error(`EText format-> Error: ${err.message || err}`);
        }
    }

    static toObj() {
        return {
            format : this.format,
        }
    }
}