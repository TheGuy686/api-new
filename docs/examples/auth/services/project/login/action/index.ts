import { EAction, GetOne } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { Login } from '@eezze/decorators/authentication/JwtAuthentication';

@EAction({
    targetRepo: 'FileStorage.UserRepo'
})
export default class LoginAction extends BaseAction {
	@GetOne({ checkOn: ['email'], map: (adm: ActionDataManager) => {
		return { email: 'r.streefkerk@gmail.com' }
	}})
    @Login({
		password: (adm: ActionDataManager) => {
			return "SomePassword123!"
		},
		verifier: (adm: ActionDataManager) => {
			return adm.action('0').result.verifier
		}
	})
    async _exec(adm: ActionDataManager) {}
}