import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';

@EModel()
export default class NotificationModel extends BaseModel {
	@UID() id?: number;
	@String() type: string;
	@String() userId: string;
	@String() status?: string;
	@String() title?: string;
	@String() message?: string;
	@String() updatedAt: string;
	@String() createdAt: string;

	constructor(args: any) {
		super();

		this.id = args.id;
		this.type = args.type;
		this.userId = args.userId;
		this.status = args.status;
		this.title = args.title;
		this.message = args.message;
		this.updatedAt = args.updatedAt;
		this.createdAt = args.createdAt;
	}
}