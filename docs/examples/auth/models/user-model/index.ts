import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Email, Boolean, Json } from '@eezze/decorators/models';

@EModel()
export default class UserModel extends BaseModel {
	@UID({
        bindProps: ['userId'],
    }) email: string;
	@String() firstName: string;
	@String() lastName: string;
	@String() username: string;
	@Boolean() emailVerified?: boolean = false;
	@Json() roles: string[] = [];
	@String() avatar: string;
	@String() salt: string;
    @String() verifier: string;

	constructor(args: any) {
		super();

		this.email = args.email;
		this.username = args.username;
		this.firstName = args.firstName;
		this.lastName = args.lastName;
		this.avatar = args.avatar;
		this.emailVerified = args.emailVerified ?? this.emailVerified;
		this.roles = args.roles ?? [];
		this.salt = args.salt;
		this.verifier = args.verifier
	}
}