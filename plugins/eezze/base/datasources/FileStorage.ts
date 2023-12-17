import FileStorageI from '../../interfaces/FileStorageI';
import Logger from '../../classes/Logger';
import EezzeTpl from '../../classes/EezzeTpl';
import EFileI from '../../interfaces/EFIleI';
import { deleteFile, fileExists, readFile, writeFile, mkdir, rmdir, ReadFileI } from '../../libs/FileMethods';

interface FileMethodsArgsI {
    rootPath: string;
    fileName: string;
    fileType?: string;
    createFileIfNotExists?: boolean;
}

export default class FileStorage implements FileStorageI {
    logger: Logger;
    db: any;
    _srcId: string = '_file_storage';
    protected _rootPath: string;
    protected _filePath: string;
    protected _fileName: string;
    protected _fileType: string = 'json';

    protected createFileIfNotExists: boolean = true;

    public get fullPath() {
        if (this._filePath && this.fileName ) return this._rootPath + this._filePath + this.fileName;
        if (this._filePath) return this._rootPath + this._filePath;
        if (this.fileName) return this._rootPath + this.fileName;
        return this._rootPath;
    }
    public get directoryPath() {
        if (this._filePath) return this._rootPath + this._filePath;
        return this._rootPath;
    }

    public get rootPath() { return this._rootPath }
    protected set rootPath(value: string) {
        this._rootPath = value.replace(/\/$/, '') + '/';
    }

    public get filePath() { return this._filePath }
    protected set filePath(value: string) {
        this._filePath = value.replace(/\/$/, '') + '/';
    }

    public get fileName() { return this._fileName }
    protected set fileName(value: string) { this._fileName = value }

    public get fileType() {
        try {
            if (typeof this._fileType === 'undefined') this.setFileTypeFromFileName();
        }
        catch (err) {
            return this._fileType
        }

        return this._fileType
    }

    protected set fileType(value: string) { this._fileType = value }

    private setFileTypeFromFileName() {
        this._fileType = this.fileName.slice(this.fileName.lastIndexOf('.') + 1, this.fileName.length);
    }

    constructor(args: FileMethodsArgsI, logger: Logger) {
        this.logger = logger;

        // this.rootPath = args?.rootPath ?? '';
        // this.fileName = args?.fileName ?? '';
        // this.fileType = args?.fileType ?? '';

        if (typeof args.createFileIfNotExists != 'undefined') {
            this.createFileIfNotExists = args.createFileIfNotExists;
        }

        if (this.createFileIfNotExists) {
            // this._createFileIfNotExists();
        }
    }

    private _createFileIfNotExists(): boolean {
        if (!this.fileExists()) {
            if (!this.createFileIfNotExists) {
                throw new Error(`File: ${this.fullPath} doesn't exist`);
            }
        }

        let fileData = ''

        if (this.fileType) {
            switch (this.fileType) {
                case 'json':
                    fileData = '{}'
                    break;
            }
        }

        return writeFile({
            path: this.rootPath,
            file: this.fileName,
            data: fileData,
            writeIfFileDoesntExist: true,
            caller: 'FileStorage.createFileIfNotExists'
        });
    }

    private parsePathTplVars(path: string, vars?: any): string {
        // this should only get evaluated if there is a string var (${ VAR-NAME }) in the string
        if (/\$\{/g.test(path)) {
            path = EezzeTpl.parseString(path, vars);
        }

        return path;
    }

    fileExists(path?: string): boolean { return fileExists(path ?? this.fullPath) }

    readFile(params: ReadFileI) {
        return readFile({
            type: params.type,
            path: params.path,
            file: params.file,
        });
    }

    delete(path?: string): boolean { return deleteFile(path) }

    /**
     *
     * @param data data object to write to file storage
     * @param fileContOverride file contents override, set equal to data if you need variable path functionality.
     * @returns
     */
    private _saveFile(path: string, fileName: string, file?: EFileI) {
        try {
            const res: any = writeFile({
                path,
                file: fileName,
                data: typeof file == 'string' ? file : file.buffer,
                createPathIfNotExists: true,
                caller: 'FileStorage._saveFile'
            });

            if (!res) {
                return {
                    success: false,
                    error: 'There was a file save error',
                };
            }

            return {
                success: true,
                fileName,
                savePath: path + fileName
            };
        }
        catch (e) {
            return {
                success: false,
                error: e.message,
            };
        }
    }

    public saveFolder(path: string): boolean {
        if (this.fileExists(path)) {
            console.log(`Ignored save "${path}" as file already exists`);
            return true;
        }

        this.logger.infoI(`Creating path "${path}"`);

        return mkdir(path);
    }

    public removeFolder(data: any, readFileVars?: object): boolean {
        this.filePath = data;
        let path = this.fullPath;

        let vars: any

        if (typeof readFileVars !== 'undefined') {
            vars = readFileVars;
        }
        else {
            vars = data
        }

        path = this.parsePathTplVars(path, vars);

        if (!this.fileExists(path)) {
            console.log(`Ignored remove "${path}", directory does not exist`);
            return true;
        }

        this.logger.infoI(`Removing path "${path}"`);

        return rmdir(this.directoryPath);
    }

    public save(path: any, fileName: string, content?: EFileI) {
        return this._saveFile(path, fileName, content);
    }

    public setFilename(name: string) {
        this.fileName = name;
    }
}