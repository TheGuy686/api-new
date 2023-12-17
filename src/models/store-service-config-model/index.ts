import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Boolean, Json } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreModel from 'models/store-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceConfigModel extends BaseModel {
    @UID() id: number;
    @String() name: string;
    @String() description: string;
    @String() type: string;
    @Json() metadata: string;
    @Boolean() active: boolean;

    @ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.active = args.active;
        this.type = args.type;
        this.metadata = args.metadata;
    }

    setStore(store: StoreModel) {
        this.store = store;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}