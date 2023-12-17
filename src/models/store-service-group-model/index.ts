import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Json, Int } from '@eezze/decorators/models';
import { OneToMany, ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreModel from 'models/store-model';
import StoreServiceModel from 'models/store-service-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceGroupModel extends BaseModel {
    @UID() id: string;
    @Int() srcId: string;
    @String() name: string;
    @String() description: string;
    @String() type: string;
    @Json() metadata: string;
    @String() stories: string;

    @ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
    @OneToMany({ joinOn: ['sgId'], model: 'StoreServiceModel', column: 'id', direction: 'output' }) services: StoreServiceModel[] = [];
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.srcId = args.srcId;
        this.name = args.name;
        this.description = args.description;
        this.type = args.type;
        this.metadata = args.metadata;
        this.stories = args.stories;
    }

    setStore(store: StoreModel) {
        this.store = store;
    }

    setServices(serv: StoreServiceModel) {
        this.services.push(serv);
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}