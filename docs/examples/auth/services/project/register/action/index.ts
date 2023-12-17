import { EAction, CreateOneIfNotExists, EWhen } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { Register } from '@eezze/decorators/authentication/JwtAuthentication';

@EAction({
	targetRepo: 'FileStorage.UserRepo'
})
export default class RegisterAction extends BaseAction {
	@Register({
		password: "SomePassword123!"
	})
	@CreateOneIfNotExists({
		checkOn: ['email'],
		map: (adm: ActionDataManager) => {
			return {
				firstName: "rolf",
				lastName: "streefkerk",
				username: "rpstreef",
				email: "r.streefkerk@gmail.com",
				roles: ["ROLE_ADMIN"],
				avatar: "/some/file/storage/path",
				salt: adm.action('0').result.salt,
				verifier: adm.action('0').result.verifier,
			}
		}
	})
	@EWhen({
		source: (adm: ActionDataManager) => adm.getLastAction().result.body,
		condition: (adm: ActionDataManager, item: any) => {
			if(typeof item !== 'undefined') return true;
		},
		action: (adm: ActionDataManager, item: any) => {
			// delete secrets
			delete item.salt
			delete item.verifier

			adm.setResult(item)
			adm.setSuccess('Registration successful!')
		}
	})
	async _exec(adm: ActionDataManager) { }
}