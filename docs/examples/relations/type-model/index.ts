import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';
import { ManyToOne, OneToOne, ManyToMany } from '@eezze/decorators/models/relation-types/OneToOne';
import UserModel from '../user-model';
import TypeDetailModel from '../type-detail-model';

@EModel()
export default class TypeModel extends BaseModel {
    @UID() id: string;
    @String() name: string;
    // foreignKey property means we're not storing this reference on this table, but on the Parent table.
    // @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'userId' }) user: UserModel;
    @ManyToMany({ model: 'UserModel', column: 'id', owner: 'user' }) users: UserModel[];
    @OneToOne({ joinOn: ['id'], model: 'TypeDetailModel', column: 'typeDetailId' }) typeDetail: TypeDetailModel;
   
    constructor(args: any) {
        super();

        this.id = args.id;
        this.name = args.name;
    }

    public setUser(user: UserModel) {
        if(typeof this.users === 'undefined') {
		    this.users = [];
		}

        this.users.push(user);
    }

    public setTypeDetail(typeDetail: TypeDetailModel) {
        this.typeDetail = typeDetail;
    }
}