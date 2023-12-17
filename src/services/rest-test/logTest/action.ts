import { CreateOne, DeleteOne, Do, EAction, FileSave, GetOne, Run } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';
import { LogicChain } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.NotificationRepo',
})
export default class LogTestAction extends BaseAction {
	// @Run()
	// @FileSave({
	// 	datasource: 'FileStorageDefault',
	// 	folder: 'avatars',
	// 	fileName: () => 'a-name.txt',
	// 	content: () => 'some content',
	// })
	// @Do({
	// 	run: (adm: ADM) => {
	// 		adm.setResult('Yup to here');
	// 	}
	// })
	@CreateOne({
		repo: 'Mysql.User',
		input: (adm: ADM) => {
			return {
				email: 'test@email.com',
				firstName: 'John',
				lastName: 'Doe',
				handle: 'bla bla',
				saltm: 'adadfasdfs',
				verifierm: 'some verifier',
			};
		},
		onSuccess: (adm: ADM) => {
			console.log('Create result: ', adm.result);
		}
	})
	@GetOne({
		repo: 'Mysql.User',
		checkOn: [ 'email' ],
		input: (adm: ADM) => {
			return {
				email: 'test@email.com',
			};
		},
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.object('user', adm.result);

			await lc.result();
		}
	})
	@DeleteOne({
		repo: 'Mysql.User',
		checkOn: [ 'email' ],
		input: (adm: ADM) => {
			return {
				email: 'test@email.com',
			};
		},
		onSuccess: (adm: ADM, lc: LogicChain) => {
			console.log('Success result: ', lc.stash.prop('user'));
		}
	})
	async _exec(adm: ADM) {
		adm.logger.info(`Hello there how are you?`);
	}
}