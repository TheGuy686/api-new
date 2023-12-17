import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int } from '@eezze/decorators/models';

@EModel()
export default class BlActionTypeModel extends BaseModel {
	@UID()     id: number;
	@String()  key?: string;
	@String()  title?: string;
	@String()  createdAt?: string;
	@Int()     createdBy?: number;
	@String()  updatedAt?: string;
	@Int()     updatedBy?: number;

	constructor(args: any) {
		super();

		this.id          = args?.id ?? '';
		this.key         = args.key;
		this.title       = args.title;
		this.createdAt   = args.createdAt;
		this.createdBy   = args.createdBy;
		this.updatedAt   = args.updatedAt;
		this.updatedBy   = args.updatedBy;
	}
}