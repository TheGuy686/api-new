import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Boolean } from '@eezze/decorators/models';

@EModel()
export default class LinterModel extends BaseModel {
	@UID()     id: number;
	@String()  key?: string;
	@String()  name?: string;
    @String()  description?: string;
	@Boolean() active?: boolean;

	constructor(args: any) {
		super();

		this.id          = args?.id ?? '';
		this.key         = args.key;
		this.name        = args.name;
		this.description = args.description;
		this.active      = args.active;
	}
}