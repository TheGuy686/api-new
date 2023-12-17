import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Boolean, Int } from '@eezze/decorators/models';

@EModel()
export default class ResponseCodeModel extends BaseModel {
	@UID()     id: number;
	@String()  projectId?: string;
	@String()  name?: string;
	@String()  description?: string;
	@String()  code?: string;
	@Boolean() enabled?: boolean = true;
	@String()  createdAt?: string;
	@Int()     createdBy?: number;
	@String()  updatedAt?: string;
	@Int()     updatedBy?: number;
	@Boolean() active?: boolean;

	constructor(args: any) {
		super();

		this.id = args?.id ?? '';
		this.projectId   = args.projectId;
		this.name        = args.name;
		this.description = args.description;
		this.code        = args.code;
		this.enabled     = args.enabled;
		this.createdAt   = args.createdAt;
		this.createdBy   = args.createdBy;
		this.updatedAt   = args.updatedAt;
		this.updatedBy   = args.updatedBy;
		this.active      = args.active
	}
}