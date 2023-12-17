import BaseService from '../../base/BaseService';
import { EService } from '../../decorators/ServiceDecorators';

@EService()
export default class ServiceDefault extends BaseService {
    async run(request: E_REQUEST, server: any) {
		return await this.action.run(request, server);
	}
}