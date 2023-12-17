import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Boolean } from '@eezze/decorators/models';

@EModel()
export default class ConnectionModel extends BaseModel {
	@UID()     id: number;
	@String()  projectId?: string;
	@String()  name?: string;
    @String()  description?: string;
	@String()  type?: string;
	@String()  metadata?: string;
	@String()  state?: string;
	@Boolean() active?: boolean;

	constructor(args: any) {
		super();

		this.id          = args?.id;
		this.projectId   = args.projectId;
		this.name        = args.name;
		this.description = args.description;
		this.type        = args.type;
		this.metadata    = args.metadata;
		this.state       = args.state;
		this.active      = args.active;
	}
}