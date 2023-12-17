import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';
import { EActionInput } from '@eezze/decorators';
import { String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GetProjectTreeFromInputActionInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'GetProjectTreeFromInputActionInput "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		bindProps: ['key'],
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectName,
		message: 'GetProjectTreeFromInputActionInput "projectName" was not set',
	})
	projectName?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.description ?? '',
		message: 'GetProjectTreeFromInputActionInput "description" was not set',
	})
	description?: string;

	// this will be server / managed service / but everything is eezze-hosted ATM
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.type ?? 'eezze-hosted',
		message: 'GetProjectTreeFromInputActionInput "type" was not set',
	})
	type?: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.host,
		message: 'GetProjectTreeFromInputActionInput "host" or "ip" was not set',
	})
	host?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.user,
		message: 'GetProjectTreeFromInputActionInput "user" was not set',
	})
	user?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.pass,
		message: 'GetProjectTreeFromInputActionInput "pass" was not set',
	})
	pass?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.sshKey,
		message: 'GetProjectTreeFromInputActionInput "sshKey" was not set',
	})
	sshKey?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.roles,
		message: 'GetProjectTreeFromInputActionInput "roles" was not set',
	})
	roles?: string;

	@Json({
		input: (adm: ActionDataManager) => EJson.parseKeyArray(adm.request.requestBody, 'vaultVals'),
		message: 'GetProjectTreeFromInputActionInput "vaultVals" was not set',
	})
	vaultVals?: string;

	@Json({
		input: (adm: ActionDataManager) => EJson.parseKeyArray(adm.request.requestBody, 'envVals'),
		message: 'GetProjectTreeFromInputActionInput "envVals" was not set',
	})
	envVals?: string;

	@String({
		input: (adm: ActionDataManager) => adm.request.requestBody?.dataSourceType,
		message: 'GetProjectTreeFromInputActionInput "dataSourceType" was not set',
	})
	dataSourceType?: string;

	@Json({
		input: (adm: ActionDataManager) => adm.request.requestBody?.dsMetadata,
		message: 'GetProjectTreeFromInputActionInput "dsMetadata" was not set',
	})
	dsMetadata?: string;
}
