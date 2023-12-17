import BaseActionInput from '@eezze/base/BaseActionInput';
import { ActionDataManager as ADM } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';
import { EActionInput } from '@eezze/decorators';
import { String, Text, Json } from '@eezze/decorators/models/types';

@EActionInput()
export default class GenerateControllerTypeFileActionInput extends BaseActionInput {
    @String({
        required: true,
        input: (adm: ADM) => adm.request.auth?.user?.id,
        message: 'GenerateControllerUpdateInput "userId" was not set',
    })
    public userId: string;

    @String({
        required: true,
        input: (adm: ADM) => `${adm.request.auth?.user?.firstName} ${adm.request.auth?.user?.lastName}`,
        message: 'GenerateControllerUpdateInput "userName" was not set',
    })
    public userName: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.projectId,
        required: true,
        message: 'GenerateControllerUpdateInput "projectId" was not set',
    })
    public projectId: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.datasource,
        required: true,
        message: 'GenerateControllerUpdateInput "datasource" was not set',
    })
    public datasource: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.sgName,
        required: true,
        message: 'GenerateControllerUpdateInput "sgName" was not set',
    })
    public sgName: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.sgType,
        required: true,
        message: 'GenerateControllerUpdateInput "sgType" was not set',
    })
    public sgType: string;

    @Json({
        input: (adm: ADM) => adm.request.requestBody?.sgMetadata,
        required: false,
        message: 'GenerateControllerUpdateInput "sgMetadata" was not set',
    })
    public sgMetadata: string;

    @Json({
        input: (adm: ADM) => adm.request.requestBody?.sgAuth,
        required: false,
        message: 'GenerateControllerUpdateInput "sgAuth" was not set',
    })
    public sgAuth: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.sgNameType,
        required: true,
        message: 'GenerateControllerUpdateInput "sgNameType" was not set',
    })
    public sgNameType: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.sgDesc,
        message: 'GenerateControllerUpdateInput "sgDesc" was not set',
    })
    public sgDesc: string;

    @String({
        input: (adm: ADM) => adm.request.requestBody?.type,
        required: true,
        message: 'GenerateControllerUpdateInput "type" was not set',
    })
    public type: string;

    @Json({
        input: (adm: ADM) => adm.request.requestBody?.services,
        serialize: (item: any, adm: ADM) => EJson.parseArray(item),
        required: true,
        message: 'GenerateControllerUpdateInput "services" was not set',
    })
    public services: string;
}
