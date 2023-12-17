import { BaseModel } from '@eezze/base';
import { EModel, UID, Int, String, Json, Boolean } from '@eezze/decorators/models';
import { OneToMany } from '@eezze/decorators/models/relation-types/relations';

import ServiceModel from 'models/service-model';

@EModel()
export default class ServiceGroupModel extends BaseModel {
    @UID() id: string;
    @Int() projectId: string;
    @String() name: string;
    @String() description: string;
    @String() type: string;
    @Json() metadata: string;
    @Boolean() active: boolean;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.projectId = args.projectId;
        this.name = args.name;
        this.description = args.description;
        this.type = args.type;
        this.metadata = args.metadata;
        this.active = args.active;
    }
}