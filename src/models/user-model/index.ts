import { BaseAuthenticationModel } from '@eezze/base';
import { EModel, UID, String, Email, Boolean, Json, Salt, Verifier } from '@eezze/decorators/models';
import { OneToMany } from '@eezze/decorators/models/relation-types/relations';
import MemberModel from 'models/member-model';

@EModel()
export default class UserModel extends BaseAuthenticationModel {
	@UID() id?: number;
	@String() firstName: string;
	@String() lastName: string;
	@String() username?: string;
	@String() password?: string;
	@Email() email?: string;
	@String() handle?: string;
	@Boolean({ default: false }) emailVerified?: boolean;
	@String() avatar: string;
	@String() salt: string;
	// @Salt({
	// 	isTransient: false,
	// }) salt: string;
	@String() verifier: string;
	// @Verifier({
	// 	isTransient: false,
	// 	saltColumn: 'salt',
	// 	passwordColumn: 'password',
	// }) verifier: string;
	@Boolean() active: boolean;
	@Json({ default: [] }) roles: string[];

	// user can be a member of many teams
	@OneToMany({ joinOn: ['userId'], model: 'MemberModel', column: 'id', direction: 'output' }) members: MemberModel[] = [];

	constructor(args: any) {
		super(args);

		this.id = args.id;
		this.handle = args.handle;
		this.email = args.email;
		this.username = args.username;
		this.firstName = args.firstName;
		this.lastName = args.lastName;
		this.password = args.password;
		this.emailVerified = !!args.emailVerified;
		this.avatar = args.avatar;
		this.salt = args.salt;
		this.verifier = args.verifier;
		this.roles = args.roles;
		this.active = !!args.active;
	}

	public setMembers(member: MemberModel) {
		this.members.push(member);
	}
}