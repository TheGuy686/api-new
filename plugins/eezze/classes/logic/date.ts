import dayjs from 'dayjs';
import { insertArgsToStr } from './misc';

export default class EDate {
    static getDate(dte: string = '') {
        return dayjs(dte);
    }

    static format(dte: any, mask: string, variables: any): string {
        const msk = insertArgsToStr(mask, variables);

        if (dte) return dte.format(msk);

        return this.getDate().format(msk);
    }

    static addDays(dte: any, days: number): string {
        if (dte) return dte.add(days, 'day').toString();
        return this.getDate(dte).add(days, 'day').toString();
    }

    static substractDays(dte: any, days: number): string {
        if (dte) return dte.subtract(days, 'day').toString();
        return this.getDate(dte).subtract(days, 'day').toString();
    }

    static toObj() {
        return {
            format: this.format.bind(this),
            addDays: this.addDays.bind(this),
            substractDays: this.substractDays.bind(this),
        };
    }
}