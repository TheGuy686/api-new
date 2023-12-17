import BaseActionInput from '@eezze/base/BaseActionInput';
import { EActionInput } from '@eezze/decorators';
import { SetterContextI, String } from '@eezze/decorators/models/types';

@EActionInput()
export default class RunTestActionInput extends BaseActionInput {
    // @String({
    //     required: true,
    //     map: (deps: any) => {
    //         return deps.req?.requestBody?.roleId;
    //     },
    // })
    // private roleId: string;

    // @String({
    //     required: false,
    //     map: (deps: any) => {
    //         return deps.req?.requestBody?.role;
    //     },
    // })
    // private role: string;
}