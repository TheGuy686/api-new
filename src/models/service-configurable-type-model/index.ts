import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Boolean, Int } from '@eezze/decorators/models';

@EModel()
export default class ServiceConfigurableTypeModel extends BaseModel {
	@UID()     id: number;
	@String()  key: string;
	@String()  name: string;
	@String()  description: string;
	@Boolean() enabled: boolean;
	@String()  createdAt?: string;
	@Int()     createdBy?: number;
	@String()  updatedAt?: string;
	@Int()     updatedBy?: number;
	@Boolean() active?: boolean;

	constructor(args: any) {
		super();

		this.id          = args.id;
		this.key         = args.key;
		this.name        = args.name;
		this.description = args.description;
		this.enabled     = args.enabled;
		this.createdAt   = args.createdAt;
		this.createdBy   = args.createdBy;
		this.updatedAt   = args.updated_at;
		this.updatedBy   = args.updatedBy;
		this.active      = args.active;
	}
}
