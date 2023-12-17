import { EAction, ServiceCaller, Success, Base64Converter, FileSave } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction()
export default class UploadProjectLogoAction extends BaseAction {
    @Base64Converter({
		content: (adm: ADM) => adm.input.logo,
	})
    @FileSave({
		datasource: 'FileStorageDefault',
		folder: 'logos',
		fileName: (adm: ADM) => adm.input.projectId,
		content: (adm: ADM) => adm.result,
	})
    @ServiceCaller({
        service: 'RestProjectsService:updateProject',
        headers: (adm: ADM) => ({
            authorization: adm.request?.auth?.idToken,
        }),
        requestBody: (adm: ADM) => ({
            id: adm.input.projectId,
            logo: adm.result.fileName,
        })
    })
    async _run() {}

    @Success()
    _success(adm: ADM) {
        return {
            success: true,
            body: 'successfull-uploaded',
        };
    }
}