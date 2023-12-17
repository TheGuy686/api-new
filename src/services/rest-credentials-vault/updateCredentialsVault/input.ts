import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Json, Int } from '@eezze/decorators/models/types';
import { pj } from '@eezze/libs/ArrayMethods';

@EActionInput()
export default class UpdateCredentialsVaultInput extends BaseActionInput {
	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
		message: 'CredentialsVault "userId" was not set',
	})
	userId: string;

	@String({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
		message: 'Connection "projectId" was not set',
	})
	projectId: string;

	@Int({
		required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.id,
		message: 'CredentialsVault "id" was not set',
	})
	id: number;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.name,
		message: 'CredentialsVault "name" was not set',
	})
	name: string;

	@String({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.description,
		message: 'CredentialsVault "description" was not set',
	})
	description: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.accessibleTo,
		message: 'CredentialsVault "accessibleTo" was not set',
	})
	accessibleTo: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => adm.request.requestBody?.updatableTo,
		message: 'CredentialsVault "updatableTo" was not set',
	})
	updatableTo: string;

	@Json({
		required: false,
		input: (adm: ActionDataManager) => pj(adm.request.requestBody?.keyValues),
		message: 'CredentialsVault "keyValues" was not set',
	})
	keyValues: string;
}
