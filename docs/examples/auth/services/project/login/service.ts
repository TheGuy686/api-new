import { BaseService } from '@eezze/base';
import { EService } from '@eezze/decorators';

@EService({
    //authenticator: 'ExpressAuthentication'
})
export default class LoginService extends BaseService {
    async run() {return await this.action.run()}
}