import { EAction, GetOneAndUpdate, EWhen } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { ResetPassword } from '@eezze/decorators/authentication/JwtAuthentication';

@EAction({
    targetRepo: 'FileStorage.UserRepo'
})
export default class ResetPasswordAction extends BaseAction {
	@ResetPassword({
		password: (adm: ActionDataManager) => {
			return "Password123!"
		}
	})
	@GetOneAndUpdate({
		checkOn: ['email'],
		map: (adm: ActionDataManager) => {
            return {
                email: "r.streefkerk@gmail.com"
            }
        },
		withValues: (adm: ActionDataManager) => {
			return {
				salt: adm.action('0').result.salt,
				verifier: adm.action('0').result.verifier
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
			adm.setSuccess('Reset password successful!')
		}
	})
    async _exec(adm: ActionDataManager) {}
}