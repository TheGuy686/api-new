import { BaseModel } from '@eezze/base';
import { EModel, UID, String, Text, Json, Boolean } from '@eezze/decorators/models';

@EModel()
export default class DatasourceModel extends BaseModel {
	@UID() id: string;
	@String() key: string;
	@String() projectId: string;
	@String() name: string;
	@String() type: string;
	@Text() description: string;
	@Text() metadata: string;
	@Json() initModel?: string;
	@Boolean() active?: boolean;

	constructor(args: any) {
		super();

		this.id = args.id;
		this.key = args.name ? args.name.trim().replace(/ /g, '') : '';
		this.projectId = args.projectId;
		this.type = args.type;
		this.name = args.name;
		this.description = args.description;
		this.metadata = args?.metadata ?? '{}';
		this.initModel = args?.initModel ?? '[]';
		this.active = args.active;
	}
}
