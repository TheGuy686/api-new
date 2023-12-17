import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';
import { OneToOne } from '@eezze/decorators/models/relation-types/OneToOne';
import ProfileModel from '../profile-model';

@EModel()
export default class ProfileDetailsModel extends BaseModel {
    @UID() id: string;
    @String() description: string;
    @OneToOne({ joinOn: ['id'], model: 'ProfileModel', foreignKey: 'profileDetailsId' }) profile: ProfileModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.description = args.description;
    }

    public setProfile(profile: ProfileModel) {
        this.profile = profile;
    }
}