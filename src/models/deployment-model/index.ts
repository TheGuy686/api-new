import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';

@EModel()
export default class DeploymentModel extends BaseModel {
	@UID() key: string;
	@String() deploymentId: string;
	@String() environmentName: string;
	@String() awsKey: string;
	@String() awsSecret: string;
	@String() projectId: string;
	@String() instanceTypeName: string;

	constructor(args: any) {
		super();

		this.deploymentId = args.deploymentId;
		this.key = args.key;
		this.environmentName = args.environmentName;
		this.awsKey = args.awsKey;
		this.awsSecret = args.awsSecret;
		this.projectId = args.projectId;
		this.instanceTypeName = args.instanceTypeName;
	}
}
