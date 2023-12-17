import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';
import { OneToOne } from '@eezze/decorators/models/relation-types/OneToOne';
import UserModel from '../user-model';
import ProfileDetailsModel from '../profile-details-model';

@EModel()
export default class ProfileModel extends BaseModel {
    @UID() id: string;
    @String() gender: string;
    @String() name: string;
    // foreignKey property means we're not storing this reference on this table, but on the Parent table 'user'. 
    // do not specify 'foreignKey' property on the user model (!)
    @OneToOne({ joinOn: ['id'], model: 'UserModel', foreignKey: 'profileId' }) user: UserModel;
    @OneToOne({ joinOn: ['id'], model: 'ProfileDetailsModel', column: 'profileDetailsId' }) profileDetails: ProfileDetailsModel;

    constructor(args: any) {
        super();

        this.id = args.id;
		this.name = args.name;
        this.gender = args.gender;
    }

    // this is a reference to the model that contains the foreignKey
    public setUser(user: UserModel) {
      this.user = user;
    }

    public setProfileDetails(profileDetails: ProfileDetailsModel) {
        this.profileDetails = profileDetails;
    }
}