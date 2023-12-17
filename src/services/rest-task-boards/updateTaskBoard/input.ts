import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class UpdateTaskBoardActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'TaskBoard "id" was not set',
	})
	id: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'TaskBoard "projectId" was not set',
	})
	projectId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.teamId,
		message: 'TaskBoard "teamId" was not set',
	})
	teamId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.board,
		message: 'TaskBoard "board" was not set',
	})
	board: string;
}