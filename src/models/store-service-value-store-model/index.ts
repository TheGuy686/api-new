import { BaseModel } from '@eezze/base';
import { EModel, UID, Int, String, Json, Boolean } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreModel from 'models/store-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceValueStoreModel extends BaseModel {
    @UID() id: string;
    @String() key: string;
    @String() value: string;
    @String() type: string;

    @ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input'}) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;

        this.key = args.key;
        this.value = args.value;
        this.type = args.type;
    }

    setStore(store: StoreModel) {
        this.store = store;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}