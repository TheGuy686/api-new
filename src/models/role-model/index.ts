import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Boolean } from '@eezze/decorators/models';

@EModel()
export default class RoleModel extends BaseModel {
    @UID()     id: number;
    @String()  role: string;
    @Int()     projectId: number;
    @String()  description: string;
    @String()  createdAt?: string;
	@Int()     createdBy?: number;
	@String()  updatedAt?: string;
	@Int()     updatedBy?: number;
    @Boolean() active?: boolean;

    constructor(args: any) {
        super();

        this.id          = args.id;
        this.role        = args.role;
        this.projectId   = args.projectId;
        this.description = args.description;
        this.createdAt   = args.createdAt;
		this.createdBy   = args.createdBy;
		this.updatedAt   = args.updated_at;
		this.updatedBy   = args.updatedBy;
        this.active      = args.active;
    }
}