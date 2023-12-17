import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import { Int } from '@eezze/decorators/models/types';

@EActionInput()
export default class DisconnectedActionInput extends BaseActionInput {}