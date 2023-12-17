import EFileI from "./EFIleI";

export default interface FileStorageI {
    rootPath: string;
    fileName: string;
    delete: () => boolean;
    fileExists: () => boolean;
    save: (path: string, fileName: string, content: EFileI) => any;
    open?: () => boolean;
    close?: () => boolean;
}