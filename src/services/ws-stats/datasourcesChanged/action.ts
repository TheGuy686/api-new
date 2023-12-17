import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import { EAction, Run } from '@eezze/decorators';

@EAction({
	targetRepo: 'Mysql.ServiceRepo',
})
export default class DatasourcesChangedAction extends BaseAction {
	@Run()
	async _exec(adm: ActionDataManager) {
		adm.setResult(adm.input);
	}
}
