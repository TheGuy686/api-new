import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { String } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateProjectCreateInput extends BaseActionInput {
  @String({
    input: (adm: ActionDataManager) => adm.request.auth?.user?.id,
    required: true
  })
  private userId: string;

  @String({
    required: true,
    input: (adm: ActionDataManager) => adm.request.requestBody?.id,
    message: 'Project "id" was not set',
  })
  id: string;

  @String({
    required: true,
    bindProps: ['key'],
    input: (adm: ActionDataManager) => adm.request.requestBody?.projectName,
    message: 'Project "projectName" was not set',
  })
  projectName?: string;

  @String({
    required: false,
    input: (adm: ActionDataManager) => adm.request.requestBody?.details,
    message: 'Project "details" was not set',
  })
  details?: string;

  @String({
    required: false,
    input: (adm: ActionDataManager) => adm.request.requestBody?.industry,
    message: 'Project "industry" was not set',
  })
  industry?: string;
}
