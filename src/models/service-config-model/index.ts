import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Boolean, Json } from '@eezze/decorators/models';

@EModel()
export default class ServiceConfigModel extends BaseModel {
    @UID() id: number;
    @String() name: string;
    @Int() projectId: number;
    @String() description: string;
    @String() type: string;
    @Json() metadata: string;
    @Boolean() active: boolean;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.name = args.name;
        this.projectId = args.projectId;
        this.description = args.description;
        this.active = args.active;
        this.type = args.type;
        this.metadata = args.metadata;
    }
}