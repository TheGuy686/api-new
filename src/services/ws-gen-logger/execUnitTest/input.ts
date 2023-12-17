import BaseActionInput from '@eezze/base/BaseActionInput';
import { EActionInput } from '@eezze/decorators';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import { Text } from '@eezze/decorators/models/types';

@EActionInput()
export default class ExecUnitTestActionInput extends BaseActionInput {
	@Text({
		required: true,
		input: (adm: ADM, lc: LogicChain) => adm.request.requestBody.projectId,
		message: 'ExecUnitTest "projectId" was not set',
	})
	projectId: string;

	@Text({
		required: true,
		input: (adm: ADM, lc: LogicChain) => adm.request.requestBody.host,
		message: 'ExecUnitTest "host" was not set',
	})
	host: string;

	@Text({
		required: true,
		input: (adm: ADM, lc: LogicChain) => adm.request.requestBody.port,
		message: 'ExecUnitTest "port" was not set',
	})
	port: string;

	@Text({
		input: (adm: ADM, lc: LogicChain) => adm.request.requestBody.uts,
		message: 'ExecUnitTest "uts" was not set',
	})
	unitTests: string;
}