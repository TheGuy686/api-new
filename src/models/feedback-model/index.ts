import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Int } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import UserModel from 'models/user-model';

@EModel()
export default class EmailModel extends BaseModel {
    @UID() id: string;
	@String() subject: string;
	@String() message?: string;

	@ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'from', direction: 'input' }) from: UserModel;

	constructor(args: any) {
		super();

		this.id = args?.id;
		this.subject = args?.subject;
		this.message = args?.message;
	}

	setFrom(user: UserModel) {
        this.from = user;
    }
}