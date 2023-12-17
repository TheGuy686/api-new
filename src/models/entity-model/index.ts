import { BaseModel } from '@eezze/base';
import { EModel, String, Json, UID } from '@eezze/decorators/models';

@EModel()
export default class EntityModel extends BaseModel {
    @UID() id: string
    @String() datasourceId: string;
    @String() projectId: string;
    @Json() entityItems: string; // keep current state of this datasource

    constructor(args: any) {
        super();

        this.id = args.id;
        this.datasourceId = args.datasourceId;
        this.projectId = args.projectId;
        this.entityItems = args.entityItems;
    }
}