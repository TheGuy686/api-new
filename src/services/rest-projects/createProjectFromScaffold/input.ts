import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Obj } from '@eezze/decorators/models/types';
import { getUniqueId } from '@eezze/libs/StringMethods';

@EActionInput()
export default class CreateProjectFromScaffoldInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'CreateProjectFromScaffoldInput "userId" was not set',
	})
	userId: string;

	@Obj({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.project,
		message: 'CreateProjectFromScaffoldInput "project" was not set',
	})
	project?: object;

	@Obj({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.project?.connection,
		message: 'CreateProjectFromScaffoldInput "project->connection" was not set',
	})
	con?: object;

	@Obj({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.project?.datasources?.loggerDs,
		message: 'CreateProjectFromScaffoldInput "datasources->loggerDs" was not set',
	})
	lgrObj?: object;
}
