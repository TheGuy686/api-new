import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenAnsibleController extends WsController {
	@On({ event: 'generate-ansible-create' })
	async generateAnsibleCreate() {}
}
