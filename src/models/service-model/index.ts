import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Json } from '@eezze/decorators/models';

@EModel()
export default class ServiceModel extends BaseModel {
    @UID() id: string;
    @Int() projectId: string;
    @Int() serviceGroupId: string;
    @String() type: string;
    @String() name: string;
    @String() description: string;
    @Json() definition: string;
    @Json() actionInput: string;
    @Json() logic: string;
    @Json() output: string;
    @String() version: string;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.projectId = args.projectId;
        this.serviceGroupId = args.serviceGroupId;
        this.type = args.type;
        this.name = args.name;
        this.description = args.description;
        this.definition = args.definition;
        this.actionInput = args.actionInput;
        this.logic = args.logic;
        this.output = args.output;
        this.version = '1.0';
    }
}