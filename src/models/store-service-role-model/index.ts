import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Boolean } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreModel from 'models/store-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceRoleModel extends BaseModel {
    @UID()     id: number;
    @String()  role: string;
    @String()  description: string;
    @String()  createdAt?: string;
	@String()  updatedAt?: string;
	@Int()     updatedBy?: number;
    @Boolean() active?: boolean;

    @ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id          = args.id;
        this.role        = args.role;
        this.description = args.description;
        this.createdAt   = args.createdAt;
        this.updatedAt   = args.updated_at;
        this.updatedBy   = args.updatedBy;
        this.active      = args.active;
    }

    setStore(store: StoreModel) {
        this.store = store;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}