import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Text } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreModel from 'models/store-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreServiceDatasourceModel extends BaseModel {
	@UID() id: string;
	@String() type: string;
	@String() name: string;
	@Text() description: string;
	@Text() metadata: string;
	@String() initModel?: string;

	@ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
	@ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input' }) createdBy: UserModel;

	constructor(args: any) {
		super();

		this.id = args.id;
		this.type = args.type;
		this.name = args.name;
		this.description = args.description;
		this.metadata = args?.metadata ?? '{}';
		this.initModel = args?.initModel ?? '[]';
	}

	setStore(store: StoreModel) {
        this.store = store;
    }

	public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}
