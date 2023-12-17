import ActionDataManager from '../../../classes/ActionDataManager';
import PDC from '../../../classes/ProjectDependancyCaches';
import LogicChain from '../../../classes/logic/LogicChain';
import { addActionToQueue } from '../ActionDecorators';
import { fileExists } from '../../../libs/FileMethods';
import { generateRandomString, kebabCase } from '../../../libs/StringMethods';
import { skipOn } from '..';
import entityDefaults from '../../../consts/entity-defaults';

const defaultKeys: any = entityDefaults.defaultKeys;

interface BaseFileI {
    datasource: string;
    input?: E_CM_CB_ANY;
    output?: E_CM_CB_ANY;
    fileName?: E_CM_CB_STR | string;
    ext?: E_CM_CB_STR | string;
    onSuccess?: E_CM_CB_VOID;
    skipOn?: ECONDITIONAL_ITEM[];
}

interface FileReadI extends BaseFileI {
    fileType?: string,
    folder?: E_CM_CB_STR | string;
}

interface FileSaveI extends BaseFileI {
    previousFileName?: E_CM_CB_STR | string;
    fileType?: string;
    folder?: E_CM_CB_STR | string;
    content: E_CM_CB_ANY;
    createFolderIfNotExists?: boolean;
}

interface DeleteFileI extends BaseFileI {
    folder?: E_CM_CB_STR | string;
    fileName: E_CM_CB_STR | string;
    ext?: E_CM_CB_STR | string;
}

export function FileSave (params: FileSaveI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function FileSave_OR (adm: ActionDataManager) {
            adm.setAction('FileSave_OR: ' + adm.totalActions);

            if (typeof params?.skipOn != 'undefined' && await skipOn(params, adm)) {
                return;
            }

            try {
                let folderCreateSuccess, folder = '', cont, fileName: string, ext: string;

                if (typeof params?.fileType != 'string') params.fileType = 'plain-text';

                const ds = PDC.getCachedDs(kebabCase(params.datasource));
                const repo = PDC.getRepo(`${ds.metadata.baseType}.${defaultKeys?.[ds.metadata.baseType]}`);

                if (typeof repo?.ds?.props?.rootPath == 'function') {
                    folder = await repo?.ds?.props?.rootPath(adm, new LogicChain(adm, this.logger)) + '/';
                }
                else if (typeof repo?.ds?.props?.rootPath == 'string' && repo?.ds?.props?.rootPath != '') {
                    folder = repo.ds.props.rootPath.replace(/\/$/, '') + '/';
                }

                if (typeof params.folder == 'function') {
                    folder += await params.folder(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params.folder == 'string') {
                    folder += params.folder;
                }

                if (typeof params?.createFolderIfNotExists == 'undefined' || params?.createFolderIfNotExists) {
                    if (!fileExists(folder)) {
                        folderCreateSuccess = repo.saveFolder(folder);
                    }
                }

                // then we need to make sure there is no leading "." after the file name for what ever reason
                if (/\.$/.test(fileName)) fileName = fileName.replace(/\.$/, '');

                if (typeof params.content == 'function') {
                    cont = await params.content(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params?.content == 'string') {
                    cont = params.content;
                }
                else cont = adm.input;

                if (typeof params?.fileName == 'function') {
                    fileName = await params.fileName(adm, new LogicChain(adm, this.logger)).toString();
                }
                else if (typeof params?.fileName == 'string') {
                    fileName = params.fileName.toString();
                }
                else fileName = generateRandomString(10);

                // if there is an ext function then we set the ext to that
                if (typeof params?.ext == 'function') {
                    ext = (await params.ext(adm, new LogicChain(adm, this.logger))).replace(/^\./, '');
                }
                // or if the ext is a string the we just set it to that
                else if (typeof params?.ext == 'string') {
                    ext = params.ext.replace(/^\./, '');
                }
                // else if the result is of EFileI type then we set the ext to the detected file type
                else if (typeof cont?.info?.extension == 'string') {
                    ext = cont.info.extension.replace(/^\./, '');
                }

                if (typeof params.folder != 'undefined' && /undefined/.test(folder)) {
                    throw `There was an error processing the given folder. The path should not have an undefined. Got "${folder}"`;
                }

                if (typeof params.fileName != 'undefined' && /undefined/.test(fileName)) {
                    throw `There was an error processing the given fileName. The path should not have an undefined. Got "${fileName}"`;
                }

                if (typeof params.ext != 'undefined' && /undefined/.test(ext)) {
                    throw `There was an error processing the given ext. The path should not have an undefined. Got "${ext}"`;
                }

                // if there is a previous file then we need to supply it and then we delete it by default. The
                // functionality might be extended in the future. But for now we'll just delete the file by default
                if (params?.previousFileName) {
                    let pfn;

                    if (typeof params?.previousFileName == 'function') {
                        pfn = await params.previousFileName(adm, new LogicChain(adm, this.logger));
                    }
                    else pfn = params.previousFileName;

                    let path = `${folder ? folder.replace(/\/$/, '') + '/' : ''}${pfn.replace(/^\//, '')}`;

                    path = `${path.replace(new RegExp(`.${ext}$`), '')}${ext ? `.${ext}` : ''}`;

                    await repo.deleteFile(path);

                    this.logger.infoI(`Deleted old file "${path}"`, 'FileDecorators->DeleteFile');
                }

                const res = await repo.saveFile({
                    path: `${folder ? folder.replace(/\/$/, '') + '/' : ''}`,
                    file: `${fileName ? fileName.replace(/^\//,'').replace(new RegExp(`.${ext}$`), '') : ''}${ext ? `.${ext}` : ''}`,
                    content: cont ?? '',
                });

                if (res?.success) {
                    adm.previousStepSuccessful = true;

                    if (typeof params.output == 'function') {
                        adm.setResultInternal(await params.output(adm, new LogicChain(adm, this.logger)));
                    }
                    else adm.setResultInternal(res, 'FileSave->if 2');

                    adm.setSuccess(`File was successfully saved`);

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }

                    this.logger.info(
                        'Decorators->File Actions->FileSave Success', 
                        'Decorators->File Actions->FileSave Success', 
                        adm, 
                        [ 'info' ]
                    );
                }
                else {
                    adm.previousStepSuccessful = false;
                    adm.setError('FileSave error');
                }
            }
            catch (e) {
console.log('Error: ', e);
                adm.previousStepSuccessful = false;
                adm.setError(`File save was unsuccessful`);
            }
        }

        addActionToQueue(target, cb, 'FileSave', params);
    };
}

export function FileRead (params: FileReadI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function FileSave_OR (adm: ActionDataManager) {
            adm.setAction('FileSave_OR: ' + adm.totalActions);

            let fullPath: string;

            try {
                if (typeof params?.skipOn != 'undefined' && await skipOn(params, adm)) {
                    return;
                }

                if (typeof params?.fileType != 'string') params.fileType = 'plain-text';

                let result, folder = '', fileName;

                const ds = PDC.getCachedDs(kebabCase(params.datasource));
                const repo = PDC.getRepo(`${ds.metadata.baseType}.${defaultKeys?.[ds.metadata.baseType]}`);

                if (typeof repo?.ds?.props?.rootPath == 'function') {
                    folder = await repo?.ds?.props?.rootPath(adm, new LogicChain(adm, this.logger)) + '/';
                }
                else if (typeof repo?.ds?.props?.rootPath == 'string' && repo?.ds?.props?.rootPath != '') {
                    folder = repo.ds.props.rootPath.replace(/\/$/, '') + '/';
                }

                if (typeof params.folder == 'function') {
                    folder += await params.folder(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params.folder == 'string') {
                    folder += params.folder;
                }

                if (typeof params?.fileName == 'function') {
                    fileName = await params.fileName(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params.fileName == 'string') {
                    fileName = params.fileName.replace(/^\//, '');
                }

                if (typeof params.folder != 'undefined' && /undefined/.test(folder)) {
                    throw new Error(`There was an error processing the given folder. The path should not have an undefined. Got "${folder}"`);
                }

                if (typeof params.fileName != 'undefined' && /undefined/.test(fileName)) {
                    throw new Error(`There was an error processing the given fileName. The path should not have an undefined. Got "${fileName}"`);
                }

                fullPath = `${folder.replace(/\/$/, '')}/${fileName}`;

                result = await repo.readFile({
                    path: folder,
                    file: fileName,
                    type: params.fileType,
                });

                if (result) {
                    adm.previousStepSuccessful = true;

                    if (typeof params.output == 'function') {
                        adm.setResultInternal(await params.output(adm, new LogicChain(adm, this.logger)));
                    }
                    else adm.setResultInternal(result, 'FileRead->if');

                    adm.setSuccess(`File was successfully read`);

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }

                    this.logger.info('Decorators->File Actions->FileRead Success', 'Decorators->File Actions->FileRead Success', adm, [ 'info' ]);
                }
                else {
                    adm.previousStepSuccessful = false;
                    adm.setResultInternal(false, 'FileRead->else');
                    adm.setError(`Couldn't read file "${fullPath}"`);
                }
            }
            catch (e) {
console.log('error: ', e);
                adm.previousStepSuccessful = false;
                adm.setError(`File read was unsuccessful`);
            }
        }

        addActionToQueue(target, cb, 'FileRead', params);
    };
}

export function FileDelete (params: DeleteFileI) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cb = async function FileSave_OR (adm: ActionDataManager) {
            adm.setAction('FileSave_OR: ' + adm.totalActions);

            try {
                if (typeof params?.skipOn != 'undefined' && await skipOn(params, adm)) {
                    return;
                }

                let results, path: string, folder = '', fileName: string, ext: string;

                const ds = PDC.getCachedDs(kebabCase(params.datasource));
                const repo = PDC.getRepo(`${ds.metadata.baseType}.${defaultKeys?.[ds.metadata.baseType]}`);

                if (typeof repo?.ds?.props?.rootPath == 'function') {
                    folder = await repo?.ds?.props?.rootPath(adm, new LogicChain(adm, this.logger)) + '/';
                }
                else if (typeof repo?.ds?.props?.rootPath == 'string' && repo?.ds?.props?.rootPath != '') {
                    folder = repo.ds.props.rootPath.replace(/\/$/, '') + '/';
                }

                if (typeof params.folder == 'function') {
                    folder += await params.folder(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params.folder == 'string') {
                    folder += params.folder;
                }

                if (typeof params?.fileName == 'function') {
                    fileName = await params.fileName(adm, new LogicChain(adm, this.logger));
                }
                else if (typeof params?.fileName == 'string') {
                    fileName = params.fileName.toString();
                }

                // then we need to make sure there is no leading "." after the file name for what ever reason
                if (/\.$/.test(fileName)) fileName = fileName.replace(/\.$/, '');

                // if there is an ext function then we set the ext to that
                if (typeof params?.ext == 'function') {
                    ext = (await params.ext(adm, new LogicChain(adm, this.logger))).replace(/^\./, '');
                }
                // or if the ext is a string the we just set it to that
                else if (typeof params?.ext == 'string') {
                    ext = params.ext.replace(/^\./, '');
                }

                if (typeof params.folder != 'undefined' && /undefined/.test(folder)) {
                    throw new Error(`There was an error processing the given folder. The path should not have an undefined. Got "${folder}"`);
                }

                if (typeof params.fileName != 'undefined' && /undefined/.test(fileName)) {
                    throw new Error(`There was an error processing the given fileName. The path should not have an undefined. Got "${fileName}"`);
                }

                if (typeof params.ext != 'undefined' && /undefined/.test(ext)) {
                    throw new Error(`There was an error processing the given ext. The path should not have an undefined. Got "${ext}"`);
                }

                path = `${folder ? folder.replace(/\/$/, '') + '/' : ''}${fileName ? fileName.replace(/^\//, '') : ''}${ext ? `.${ext}` : ''}`;

                results = await repo.deleteFile(path);

                if (results) {
                    adm.previousStepSuccessful = true;

                    if (typeof params.output == 'function') {
                        adm.setResultInternal(await params.output(adm, new LogicChain(adm, this.logger)));
                    }
                    else adm.setResultInternal(results, 'FileDelete->if');

                    adm.setSuccess('File was successfully deleted');

                    if (typeof params?.onSuccess == 'function') {
                        await params?.onSuccess(adm, new LogicChain(adm, this.logger));
                    }

                    this.logger.info(
                        'Decorators->File Actions->FileDelete Success',
                        'Decorators->File Actions->FileDelete Success',
                        adm,
                        [ 'info' ],
                    );
                }
                else {
                    adm.previousStepSuccessful = true;
                    adm.setResultInternal(false, 'FileDelete->else');
                    adm.setSuccess(`File  was not successfully saved.`);
                }
            }
            catch (e) {
console.log('ERROR: ', e);
                adm.previousStepSuccessful = false;
                adm.setError(`File delete was unsuccessful`);
            }
        }

        addActionToQueue(target, cb, 'FileDelete', params);
    };
}