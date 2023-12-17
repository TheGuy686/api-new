import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager } from '@eezze/classes';
import { EActionInput } from '@eezze/decorators';
import {  String, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class HostMouseMovedActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request?.auth?.user?.id,
        message: 'HostMouseMoved "projectId" was not set',
    })
    userId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.projectId,
        message: 'HostMouseMoved "projectId" was not set',
    })
    projectId: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.mouseX,
        message: 'HostMouseMoved "mouseX" was not set',
    })
    mouseX: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.mouseY,
        message: 'HostMouseMoved "mouseX" was not set',
    })
    mouseY: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.widthPercent,
        message: 'HostMouseMoved "widthPercent" was not set',
    })
    widthPercent: string;

    @String({
        required: true,
        input: (adm: ActionDataManager) => adm.request.requestBody?.heightPercent,
        message: 'HostMouseMoved "heightPercent" was not set',
    })
    heightPercent: string;
}
