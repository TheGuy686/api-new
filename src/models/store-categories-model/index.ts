import { BaseModel } from '@eezze/base';
import { EModel, String, Json, UID } from '@eezze/decorators/models';

@EModel()
export default class StoreCategoriesModel extends BaseModel {
    @UID() id: string
    @String() name: string;
    @String() description: string;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
    }
}