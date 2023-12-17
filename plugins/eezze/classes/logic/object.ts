
export default class EObject {
    static merge(obj1: object, obj2: object) {
        return {
            ...obj1,
            ...obj2,
        };
    }

    static toObj() {
        return {
            merge: this.merge,
        }
    }
}