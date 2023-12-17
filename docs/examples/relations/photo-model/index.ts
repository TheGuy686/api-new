import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/OneToOne';
import UserModel from '../user-model';

@EModel()
export default class PhotoModel extends BaseModel {
    @UID() id: string;
    @String() url: string;
    // foreignKey property means we're not storing this reference on this table, but on the Parent table.
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'userId' }) user: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.url = args.url;
    }

    // this is a reference to the model that contains the foreignKey
    public setUser(user: UserModel) {
       this.user = user;
    }
}