import ProjectDependancyCaches from '../../classes/ProjectDependancyCaches';
import ActionDataManager from '../../classes/ActionDataManager';

export default class EFile {
    static FolderCreate(
        adm: ActionDataManager,
        repo?: any,
        folder?: string | ((adm: ActionDataManager) => string),
        readFileVars?: object,
    ) {
        try {
            let results, customRepo;

            if (repo) {
                customRepo = ProjectDependancyCaches.getRepo(repo);
            }
            else {
                customRepo = repo;
            }

            if (typeof folder == 'function') {
                results = customRepo.saveFolder(folder(adm), readFileVars)
            }
            else if (folder) {
                results = customRepo.saveFolder(folder, readFileVars)
            }

            if (results) {
                adm.logger.info('EFile->FolderCreate Success', 'EFile->FolderCreate Success', adm, [ 'info' ]);
            }
            else {
                throw Error(`FolderCreate error: ${results}`);
            }
        }
        catch (e) {
            const em = `EFile: FolderCreate: "${e.message || e}"`;

            adm.logger.errorI(`EFile:FolderCreate: ${e.message}`, 'EFile: catch');

            adm.previousStepSuccessful = false;
            adm.setError(`Folder Create was unsuccessful`);

            throw em;
        }
    }

    static FolderRemove(
        adm: ActionDataManager,
        repo?: any,
        folder?: string | ((adm: ActionDataManager) => string),
        readFileVars?: object,
    ) {
        try {
            let results, customRepo;

            if (repo) {
                customRepo = ProjectDependancyCaches.getRepo(repo);
            }
            else {
                customRepo = repo;
            }

            if (typeof folder == 'function') {
                results = customRepo.removeFolder(folder(adm), readFileVars)
            }
            else if (folder) {
                results = customRepo.removeFolder(folder, readFileVars)
            }

            if (results) {
                adm.logger.info('EFile->FolderRemove Success', 'EFile->FolderRemove Success', adm, [ 'info' ]);
            }
            else {
                throw Error(`Folder Remove error: ${results}`);
            }
        }
        catch (e) {
            const em = `EFile: FolderRemove: "${e.message || e}"`;

            adm.logger.errorI(`EFile:FolderRemove: ${e.message}`, 'EFile: catch');

            adm.previousStepSuccessful = false;
            adm.setError(`Folder Remove was unsuccessful`);

            throw em;
        }
    }

    static FileSave (
        adm: ActionDataManager,
        repo?: any,
        input?: (adm: ActionDataManager) => any,
        folder?: string | ((adm: ActionDataManager) => string),
        fileName?: string | ((adm: ActionDataManager) => string),
        fileContOverride?: ((adm: ActionDataManager) => any) | any,
        readFileVars?: object,
    ) {
        try {
            let folderCreateSuccess, results, customInput, customRepo;

            if (repo) {
                customRepo = ProjectDependancyCaches.getRepo(repo);
            }
            else {
                customRepo = repo;
            }

            if (typeof fileName == 'function') {
                customRepo.setFileName(fileName(adm));
            }
            else {
                customRepo.setFileName(fileName);
            }

            if (typeof folder == 'function') {
                folderCreateSuccess = customRepo.saveFolder(folder(adm), readFileVars)
            }
            else if (folder) {
                folderCreateSuccess = customRepo.saveFolder(folder, readFileVars)
            }

            if (typeof input == 'function') {
                customInput = input(adm);
            }
            else if (adm.nextActionInput) {
                customInput = adm.nextActionInput;
            }
            else {
                customInput = adm.input;
            }

            // explicitly set content override, optional.
            if (typeof fileContOverride == 'function') {
                fileContOverride = fileContOverride(adm);
            }

            if ( (fileName && folderCreateSuccess) || typeof folder === 'undefined') {
                results = customRepo.saveFile(customInput, fileContOverride);
            }
            else {
                throw Error(`File  was not successfully saved.`);
            }

            if (results) {
                adm.logger.info('EFile->FileSave Success', 'EFile->FileSave Success', adm, [ 'info' ]);
            }
            else {
                throw Error(`File save error: ${results}`);
            }
        }
        catch (e) {
            const em = `EFile: SaveFile: "${e.message || e}"`;

            adm.logger.errorI(`EFile:SaveFile: ${e.message}`, 'EFile: catch');

            adm.previousStepSuccessful = false;
            adm.setError(`File save was unsuccessful`);

            throw em;
        }
    }
}