import { BaseService } from '@eezze/base';
import { EService } from '@eezze/decorators';

@EService({
    //authenticator: 'ExpressAuthentication'
})
export default class RunTest2Service extends BaseService {
    async run() {return await this.action.run()}
}