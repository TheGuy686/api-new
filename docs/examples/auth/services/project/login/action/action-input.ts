import BaseActionInput from '@eezze/base/BaseActionInput';
import { EActionInput } from '@eezze/decorators';
import { SetterContextI, String } from '@eezze/decorators/models/types';

@EActionInput()
export default class LoginActionInput extends BaseActionInput {
    /* @String({
        required: true,
        map: (deps: any) => {
            return deps.req?.requestBody?.someValue;
        },
    })
    private someValue: string; */
}