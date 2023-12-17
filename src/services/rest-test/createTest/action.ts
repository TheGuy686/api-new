import { EAction, Do, RenderTemplate, FileSave, Base64Converter } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ADM from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	// targetRepo: 'FileStorage.DefaultFileStorage',
})
export default class CreateTestAction extends BaseAction {
	@RenderTemplate({
		prettify: false,
		template: 'test',
		templateVars: (adm: ADM) => ({
			message: 'THIS IS COMING FROM RYAN',
		})
	})
	@Base64Converter({
		content: (adm: ADM) => adm.input.image,
	})
	@Do({
		run: (adm: ADM) => {
			// console.log('RESULT: ', adm.result);
		}
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: 'test',
		fileName: 'JesusSonOfMagesty',
		content: (adm: ADM) => adm.action(1).result,
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: 'test',
		fileName: 'something',
		ext: 'txt-cus',
		content: (adm: ADM) => 'something from here',
	})
	@Do({
		run: (adm: ADM) => {
			console.log(adm.result);
			adm.setResult('File was successfully saved');
		}
	})
	async _exec() {}
}
