import { BaseModel } from '@eezze/base';
import { EModel, UID, Int, String, Json, Boolean } from '@eezze/decorators/models';

@EModel()
export default class ValueStoreModel extends BaseModel {
    @UID() id: string;
    @Int() projectId: string;
    @String() key: string;
    @String() value: string;
    @String() type: string;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.projectId = args.projectId;

        this.key = args.key;
        this.value = args.value;
        this.type = args.type;
    }
}