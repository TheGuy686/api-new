import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenControllersController extends WsController {
	@On({ event: 'generate-controller-delete' })
	async generateControllerDelete() {}

	@On({ event: 'generate-controller-create-update' })
	async generateControllerCreateUpdate() {}

	@On({ event: 'generate-controller-type-file' })
	async generateControllerTypeFile() {}
}
