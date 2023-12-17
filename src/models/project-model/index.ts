import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Boolean } from '@eezze/decorators/models';
import { OneToMany } from '@eezze/decorators/models/relation-types/relations';
import TeamModel from 'models/team-model';

@EModel()
export default class ProjectModel extends BaseModel {
    @UID() id: string;
    @Int() userId: number;
    @String() projectName: string;
    @String() details: string;
    @String() handle: string;
    @String() industry: string;
    @String() logo: string;
    @Boolean({ isTransient: true }) hasLogger: boolean;

    // many teams in this project, one project for each of the teams. Foreignkey is projectId on the team table.
    @OneToMany({ joinOn: ['projectId'], model: 'TeamModel', column: 'id', direction: 'output' }) teams: TeamModel[] = [];

    constructor(args: any) {
        super();

        this.id = args.id;
        this.userId = args.userId;
        this.projectName = args.projectName;
        this.details = args.details;
        this.handle = args.handle;
        this.industry = args.industry;
        this.hasLogger = !!args?.hasLogger;
        this.logo = args?.logo;
    }

    setTeams(team: TeamModel) {
        this.teams.push(team);
    }
}