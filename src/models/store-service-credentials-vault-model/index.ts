import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Json, Boolean } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreModel from 'models/store-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceCredentialsVaultModel extends BaseModel {
    @UID()     id: number;
    @String()  name: string;
    @String()  description: string;
    @Json()  accessibleTo: string;
    @Json()  updatableTo: string;
    @Json()    keyValues: JSON;
	@Int()     updatedBy?: number;
    @Boolean() active?: boolean;

    @ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id           = args.id;
        this.name         = args.name;
        this.description  = args.description;
        this.accessibleTo = args.accessibleTo;
        this.updatableTo  = args.updatableTo;
        this.keyValues    = args.keyValues;
		this.createdBy    = args.createdBy;
		this.updatedBy    = args.updatedBy;
        this.active       = args.active;
    }

    setStore(store: StoreModel) {
        this.store = store;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}