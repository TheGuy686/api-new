import { BaseModel } from '@eezze/base';
import { EModel, UID, Boolean, String } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import TeamModel from 'models/team-model';
import UserModel from 'models/user-model';

@EModel()
export default class MemberModel extends BaseModel {
    @UID() id: string;
    @Boolean() accepted: boolean;
    @Boolean() active: boolean;

    // one membership exactly for one team and one user.
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'userId', direction: 'input' }) user: UserModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;
    @ManyToOne({ joinOn: ['id'], model: 'TeamModel', column: 'teamId', direction: 'input' }) team: TeamModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.accepted = args.accepted;
        this.active = args.active;
    }

    public setUser(user: UserModel) {
        this.user = user;
    }

    public setTeam(team: TeamModel) {
        this.team = team;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}