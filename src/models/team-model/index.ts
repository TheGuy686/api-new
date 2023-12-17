import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Boolean } from '@eezze/decorators/models';
import { OneToOne, ManyToOne, OneToMany } from '@eezze/decorators/models/relation-types/relations';
import MemberModel from 'models/member-model';
import ProjectModel from 'models/project-model';
import BoardModel from 'models/board-model';

@EModel()
export default class TeamModel extends BaseModel {
    @UID() id: string;
    @String() name: string;
    @String() description: string;
    @Boolean() active: boolean;

    // foreignKey: many teams for one projectId
    @ManyToOne({ joinOn: ['id'], model: 'ProjectModel', column: 'projectId', direction: 'input' }) project: ProjectModel;

    // one team can have many members.
    @OneToMany({ joinOn: ['teamId'], model: 'MemberModel', column: 'id', direction: 'output'}) members: MemberModel[] = [];
    @OneToOne({ joinOn: ['id'], model: 'BoardModel', foreignKey: 'teamId' , direction: 'output' }) board: BoardModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.name = args.name;
        this.description = args.description;
        this.active = !!args.active;
    }

    public setBoard(board: BoardModel) {
        this.board = board;
    }

    public setProject(project: ProjectModel) {
       this.project = project;
    }

    public setMembers(member: MemberModel) {
        this.members.push(member);
    }
}