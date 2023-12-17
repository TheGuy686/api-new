import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';
@EActionInput()
export default class GenerateMigrationSetupInput extends BaseActionInput {
  @String({
    input: (adm: ActionDataManager) => adm.request.requestBody?.id,
    required: true
  })
  private id: string;

  @String({
    input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
    required: true
  })
  private userId: string;

  @String({
    input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
    required: true,
  })
  private projectId: string;

  @String({
    input: (adm: ActionDataManager) => adm.request.requestBody?.type,
    required: true,
  })
  private type: string;
}
