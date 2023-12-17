const fs = require('fs-extra');

import { accessSync, constants } from 'node:fs';

const p = require('path');

let Path: any;

export interface ReadFileI {
    file: string;
    type?: string;
    path?: string;
    content?: any;
    doDebug?: boolean;
}

interface WriteFileI {
    file: string;
    data: any;
    path?: string;
    writeIfFileDoesntExist?: boolean;
    createPathIfNotExists?: boolean;
    caller?: string;
}

export default class FileMethods {
    rootDir (p: string) {
        if (Path == null) Path = require('path');

        return Path.dirname(p);
    }

    dirFiles (dir: string, extFilters?: string) : string[] {
        if (!this.fileExists(dir)) {
            console.error(`File dir does not exist: ${dir}`);
            return [];
        }

        const files = fs.readdirSync(dir);

        if (typeof extFilters == 'string') {
            return files.filter((file: any) => {
                return p.extname(file).toLowerCase() === extFilters;
            });
        }

        return files;
    }

    fileExists(path: string): boolean {
        try {
            return fs.existsSync(path);
        }
        catch (err) {
            return false;
        }
    }

    isDir(path: string): boolean {
        try {
            const stats = fs.statSync(path);

            return stats.isDirectory();
        }
        catch (e) {
            return false;
        }
    }

    /**
     * @param path path, default process.env.PROJECTS_FILE_ROOT
     * @param file filename with extension
     * @param type what kind of file to read, default: json
     * @returns by default returns an object
     */
    readFile(params: ReadFileI): any {
        if (typeof params.type == 'undefined') params.type = 'json';
        if (typeof params.path == 'undefined') params.path = '';

        if (params.doDebug) {
            console.warn('Reading file: ' + params.path + params.file);
        }

        const bufferData = fs.readFileSync(params.path + params.file)

        try {
            switch (params.type) {
                case 'json':
                    return JSON.parse(bufferData.toString())
                default:
                    console.error(`Type ${params.type} unknown`)
                    break
            }
        } catch (err) {
            console.error(err.message)
            return {}
        }

        return {}
    }

    /**
     *
     * @param path path, default process.env.PROJECTS_FILE_ROOT
     * @param file filename with extension
     * @param data all data to store in this file
     * @returns success or failed with error message
     */
    writeFile(params: WriteFileI): boolean {
        if (typeof params.path == 'undefined') params.path = '';

        try {
            const path = (params.path + params.file).replace(/\/\//g, '/');

            if (params?.writeIfFileDoesntExist && this.fileExists(path)) {
                console.warn(`Ignored saving file: "${path}" as writeIfFileDoesntExist was set and file exists at the given path`);
                return true;
            }

            if (typeof params?.caller != 'undefined') {
                console.log(`Writing file from "${params?.caller}" -> "${path}"`);
            }

            fs.writeFileSync(path, params.data);

            return true;
        }
        catch (e) {
            console.error('writeFile Error: ', e)
            return false
        }
    }
}

export function rootDir (p: string) {
    if (Path == null) Path = require('path');

    return Path.dirname(p);
}

export function dirFiles (dir: string, extFilters?: string | string[]) : string[] {
    if (!fileExists(dir)) {
        console.error(`File dir does not exist: ${dir}`);
        return [];
    }

    const files = fs.readdirSync(dir);

    if (typeof extFilters == 'string') {
        return files.filter((file: any) => {
            return p.extname(file).toLowerCase() === extFilters;
        });
    }
    else if (Array.isArray(extFilters)) {
        return files.filter((file: any) => {
            return !extFilters.includes(p.extname(file).toLowerCase());
        });
    }

    return files;
}

export function dirDirectories (dir: string) : string[] {
    if (!fileExists(dir) || !isDir(dir)) {
        console.error(`File dir does not exist: ${dir}`);
        return [];
    }``

    const files = fs.readdirSync(dir);

    return files.filter((file: any) => {
        return isDir(`${dir}/${file}`);
    });
}

export function fileExists(path: string): boolean {
    try {
        return fs.existsSync(path);
    }
    catch (err) {
        return false;
    }
}

export function isDir(path: string): boolean {
    try {
        const stats = fs.statSync(path);

        return stats.isDirectory();
    }
    catch (e) {
        return false;
    }
}

/**
 * @param path path, default process.env.PROJECTS_FILE_ROOT
 * @param file filename with extension
 * @param type what kind of file to read, default: json
 * @returns by default returns an object
 */
 export function readFile(params: ReadFileI): any {
    let spath: string = '';

    if (params.path) spath = (params.path as string).replace(/\/$/, '') + '/';

    spath += params.file;

    try {
        const fileCont = fs.readFileSync(spath).toString();

        switch (params.type) {
            case 'json': return JSON.parse(fileCont);
            case 'yaml': return require('yaml').parse(fileCont);
        }

        return fileCont ?? '';
    }
    catch (err) {
        console.error(err)
        return;
    }
}

/**
 *
 * @param path path, default process.env.PROJECTS_FILE_ROOT
 * @param file filename with extension
 * @param data all data to store in this file
 * @returns success or failed with error message
 */
export function writeFile(params: WriteFileI): boolean {
    if (typeof params.path == 'undefined') params.path = '';

    if (!/\/$/.test(params.path)) params.path = params.path + '/';

    try {
        const fullPath = (params.path + params.file).replace(/\/\//g, '/');
        const fileExistsCheck: boolean = fileExists(fullPath);

        // check the path root folder exists and create if not
        if (!fileExistsCheck && params?.createPathIfNotExists) {
            if (!checkWritePermissions(p.dirname(params.path))) {
                throw new Error(`FileMethods->writeFile 1: node doesn't have write permissions to folder "${p.dirname(params.path)}"`);
            }

            fs.mkdirSync(p.dirname(params.path), { recursive: true });
        }

        if (!checkWritePermissions(params.path)) {
            throw new Error(`FileMethods->writeFile 2: node doesn't have write permissions to folder "${params.path}"`);
        }

        // console.log(`SAVING TO PATH: ${fullPath}\n`);

        if (params?.writeIfFileDoesntExist && fileExistsCheck) {
            console.warn(`Ignored saving file: "${fullPath}" as writeIfFileDoesntExist was set and file exists at the given path`);
            return true;
        }

        if (typeof params?.caller != 'undefined') {
            console.log(`Writing file from "${params?.caller}" -> "${fullPath}"`);
        }

        fs.writeFileSync(fullPath, params.data, { flag: 'w' });

        return true;
    }
    catch (e) {
        console.error('writeFile Error: ', e);
        return false;
    }
}

export function deleteFile(path: string, throwErrors: boolean = false) {
    try {
        if (!fileExists(path)) return true;

        if (isDir(path)) {
            fs.rmSync( path, { recursive: true } );
        }
        else {
            fs.unlinkSync(path);
        }

        return true;
    }
    catch (err) {
        if (throwErrors) {
            throw err?.message ?? err;
        }
        else {
            console.error('deleteFile error: ', err);
            return false;
        }
    }
}

export function mkdir(path: string) {
    try {
        fs.mkdirSync(path, { recursive: true });

        return true;
    }
    catch(err) {
        console.error('Mkdir error: ', err);

        return false;
    }
}

export function rmdir(path: string, throwErrors: boolean = false) {
    try {
        if (!fileExists(path)) return true;

        fs.removeSync(path, { recursive: true });

        return true;
    }
    catch(err) {
        if (throwErrors) throw new Error(err);

        else {
            console.error('Mkdir error: ', err);
            return false;
        }
    }
}

export function checkWritePermissions(folderPath: string) {
    // try {
    //     fs.mkdirSync(`${folderPath}/.tempdir`);
    //     fs.rmdirSync(`${folderPath}/.tempdir`); // Clean up the temporary directory
    //     console.log('Node.js has write permissions on the folder.');
    //     return true;
    // }
    // catch (error) {
    //     console.error('Node.js does not have write permissions on the folder.');
    //     return false;
    // }
    try {
        accessSync(folderPath, constants.W_OK);

        return true;
    }
    catch (err) {
        return false;
    }
}