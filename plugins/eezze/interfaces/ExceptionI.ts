import { ActionDataManager } from "../classes";

export default interface ExceptionI {
    name: string;
    condition: (adm: ActionDataManager) => boolean;
}