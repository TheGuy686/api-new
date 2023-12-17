import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateMigrationUpdateInput extends BaseActionInput {
  @String({
    input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
    required: true,
    message: 'GenerateMigrationUpdateInput "userId" was not set',
  })
  private userId: string;

  @String({
    input: (adm: ActionDataManager) => adm.request.requestBody?.id,
    required: true,
    message: 'GenerateMigrationUpdateInput "id" was not set',
  })
  private id: string;

  @String({
    input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
    required: true,
    message: 'GenerateMigrationUpdateInput "projectId" was not set',
  })
  private projectId: string;

  @String({
    input: (adm: ActionDataManager) => adm.request.requestBody?.type,
    required: true,
    message: 'GenerateMigrationUpdateInput "type" was not set',
  })
  private type: string;

  @Json({
    required: true,
		input: (adm: ActionDataManager) => adm.request.requestBody?.entities,
		message: 'GenerateMigrationUpdateInput "entities" was not set',
	})
	entities: string;
}
