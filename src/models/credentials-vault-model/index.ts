import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int, Json, Boolean } from '@eezze/decorators/models';

@EModel()
export default class CredentialsVaultModel extends BaseModel {
    @UID()     id: number;
    @Int()     projectId: number;
    @String()  name: string;
    @String()  description: string;
    @Json()  accessibleTo: string;
    @Json()  updatableTo: string;
    @Json()    keyValues: string;
    @String()  createdAt?: string;
	@Int()     createdBy?: number;
	@String()  updatedAt?: string;
	@Int()     updatedBy?: number;
    @Boolean() active?: boolean;

    constructor(args: any) {
        super();

        this.id           = args.id;
        this.projectId    = args.projectId;
        this.name         = args.name;
        this.description  = args.description;
        this.accessibleTo = args.accessibleTo;
        this.updatableTo  = args.updatableTo;
        this.keyValues    = args.keyValues;
        this.createdAt    = args.createdAt;
		this.createdBy    = args.createdBy;
		this.updatedAt    = args.updatedAt;
		this.updatedBy    = args.updatedBy;
        this.active       = args.active;
    }
}