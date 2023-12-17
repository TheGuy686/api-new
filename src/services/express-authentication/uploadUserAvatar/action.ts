import { EAction, Base64Converter, ServiceCaller } from '@eezze/decorators';
import { FileSave } from '@eezze/decorators/actions/file-actions';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class UploadUserAvatarAction extends BaseAction {
	@Base64Converter({
		content: (adm: ADM) => adm.input.avatar,
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: 'avatars',
		fileName: (adm: ADM) => adm.input.userId,
		content: (adm: ADM) => adm.result,
	})
	@ServiceCaller({
		service: 'ExpressAuthenticationService:updateAccount',
		headers: (adm: ADM) => ({
			authorization: adm.request?.auth?.idToken,
		}),
		requestBody: (adm: ADM) => ({
			id: adm.request?.auth?.user?.id,
			avatar: adm.result?.fileName,
		}),
	})
	async _run() {}
}