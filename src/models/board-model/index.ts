import { BaseModel } from '@eezze/base';
import { EModel, UID, Json } from '@eezze/decorators/models';
import { OneToOne } from '@eezze/decorators/models/relation-types/relations';
import TeamModel from 'models/team-model';

@EModel()
export default class BoardModel extends BaseModel {
    @UID() id: string;
    @Json() board: object;

    // one membership exactly for one team and one user.
    @OneToOne({ joinOn: ['id'], model: 'TeamModel', column: 'teamId', direction: 'input' }) team: TeamModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.board = args.board;
    }

    public setTeam(team: TeamModel) {
        this.team = team;
    }
}