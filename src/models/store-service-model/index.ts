import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Text, Json } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreServiceGroupModel from 'models/store-service-group-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceModel extends BaseModel {
    @UID() id: string;
    @String() type: string;
    @String() name: string;
    @String() description: string;
    @Json() definition: string;
    @Json() actionInput: string;
    @Json() logic: string;
    @Json() output: string;
    @Json() story: string;
    @String() fullStory: string;

    @ManyToOne({joinOn: [ 'id' ], model: 'StoreServiceGroupModel', column: 'sgId', direction: 'input' }) storeServiceGroup: StoreServiceGroupModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.type = args.type;
        this.name = args.name;
        this.description = args.description;
        this.definition = args.definition;
        this.actionInput = args.actionInput;
        this.logic = args.logic;
        this.output = args.output;
        this.story = args.story;
        this.fullStory = args.fullStory;
    }

    public setStoreServiceGroup(ssg: StoreServiceGroupModel) {
        this.storeServiceGroup = ssg;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}