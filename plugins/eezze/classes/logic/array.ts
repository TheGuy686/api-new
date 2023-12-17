

export default class EArray {
    public static mergeUnique(arr1: object, arr2: object) {
        if (!Array.isArray(arr1)) throw new Error(`EArray.mergeUnique: arr1 is not array type. Got "${typeof arr1}"`);
        if (!Array.isArray(arr2)) throw new Error(`EArray.mergeUnique: arr2 is not array type. Got "${typeof arr2}"`);
        return [...new Set([...arr1 ,...arr2])];
    }

    public static mergeLists(arr1: any[], arr2: any[] = [], arr3: any[] = [], arr4: any[] = [], arr5: any[] = [], arr6: any[] = []) {
        return [
            ...arr1,
            ...arr2,
            ...arr3,
            ...arr4,
            ...arr5,
            ...arr6,
        ];
    }

    public static arrayDiff(arr1: any[], arr2: any[]) {
        if (!arr1 || !arr2) return [];

        if (!Array.isArray(arr1)) {
            throw new Error(`\n\nArrayMethods:arrayDiff: arr1 was not an array. Got: ${arr1}\n`);
        }

        if (!Array.isArray(arr2)) {
            throw new Error(`\n\nArrayMethods:arrayDiff: arr2 was not an array. Got: ${arr2}\n`);
        }

        return arr1.filter(x => !arr2.includes(x));
    }

    public static arrayEqual(arr1: any[], arr2: any[]) {
        if (!arr1 || !arr2) return [];

        if (!Array.isArray(arr1)) {
            throw new Error(`\n\nArrayMethods:arrayDiff: arr1 was not an array. Got: ${arr1}\n`);
        }

        if (!Array.isArray(arr2)) {
            throw new Error(`\n\nArrayMethods:arrayDiff: arr2 was not an array. Got: ${arr2}\n`);
        }

        return arr1.filter(x => arr2.includes(x));
    }

    public static evenNumList(src: any, min: number, max: number) {
        const evenNumbers = [];

        // Adjust min and max if necessary to ensure the range is valid
        min = Math.ceil(min);
        max = Math.floor(max);

        // Loop through the range and check each number for evenness
        for (let num = min; num <= max; num++) {
            if (num % 2 === 0) {
                evenNumbers.push(num);
            }
        }

        return evenNumbers;
    }

    public static oddNumList(src: any, min: number, max: number) {
        const oddNumbers = [];

        // Adjust min and max if necessary to ensure the range is valid
        min = Math.ceil(min);
        max = Math.floor(max);

        // Loop through the range and check each number for oddness
        for (let num = min; num <= max; num++) {
            if (num % 2 !== 0) {
                oddNumbers.push(num);
            }
        }

        return oddNumbers;
    }

    public static toObj() {
        return {
            mergeUnique: this.mergeUnique,
            mergeLists: this.mergeLists,
            evenNumList: this.evenNumList,
            oddNumList: this.oddNumList,
        };
    }
}