import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenConnectionsController extends WsController {
	@On({ event: 'generate-connection-delete' })
	async generateConnectionDelete() {}

	@On({ event: 'generate-connection-create-update' })
	async generateConnectionCreateUpdate() {}
}
