import ActionResponse from '../classes/ActionResponse';

type SuccessErrorResponseI = (res: any) => ActionResponse;

type ExecI = (res: any) => void;

export default interface BaseActionI {
    _exec: ExecI;
    _success?: SuccessErrorResponseI;
    _error?: SuccessErrorResponseI;
}