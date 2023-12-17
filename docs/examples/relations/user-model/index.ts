import { BaseAuthenticationModel } from '@eezze/base';
import { EModel, UID, String, Email, Boolean, Json } from '@eezze/decorators/models';
import { OneToMany, OneToOne, ManyToMany } from '@eezze/decorators/models/relation-types/OneToOne';
import ProfileModel from 'models/profile-model';
import PhotoModel from 'models/photo-model';
import TypeModel from 'models/type-model';

@EModel()
export default class UserModel extends BaseAuthenticationModel {
	@UID() id: string;
	@String() firstName: string;
	@String() lastName: string;
	@String() username?: string;
	@String() password?: string;
	@Email() email?: string;
	@Boolean() emailVerified?: boolean = false;
	@String() salt: string;
	@String() verifier: string;
	@Json() roles: string[] = [];

	// joinOn: the joined model's property we perform the SQL join on, profile.id
	// model: type of the join
	// column: represents the actual column name in the database.
	// profile: class property name, profileId is the database representation
	@OneToOne({ joinOn: ['id'], model: 'ProfileModel', column: 'profileId' }) profile: ProfileModel;
	@OneToMany({ joinOn: ['userId'], model: 'PhotoModel', column: 'id'}) photos: PhotoModel[];

	// owner: indicates who "owns" the relationship and thus determines the join table name. E.g. user_types_type
	@ManyToMany({ model: 'TypeModel', column: 'id', owner: 'user' }) types: TypeModel[];

	constructor(args: any) {
		super(args);

		this.id = args.id;
		this.email = args.email;
		this.username = args.username;
		this.firstName = args.firstName;
		this.lastName = args.lastName;
		this.password = args.password;
		this.emailVerified = args.emailVerified ?? this.emailVerified;
		this.salt = args.salt;
		this.verifier = args.verifier;
		this.roles = args.roles ?? [];
	}

	public setProfile(profile: ProfileModel) {
		this.profile = new ProfileModel(profile);
	}

	public setPhoto(photo: PhotoModel) {
		if(typeof this.photos === 'undefined') {
			this.photos = [];
		}

		this.photos.push(photo);	
	}

	public setType(type: TypeModel) {
		if(typeof this.types === 'undefined') {
			this.types = [];
		}

		this.types.push(type);
	}
}