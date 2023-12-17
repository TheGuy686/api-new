import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenServsController extends WsController {
	@On({ event: 'generate-service-all' })
	async generateServAll() {}

	@On({ event: 'generate-service-refresh' })
	async generateServRefresh() {}

	@On({ event: 'generate-service-delete' })
	async generateServDelete() {}

	@On({ event: 'generate-service-create-update' })
	async generateServCreateUpdate() {}
}
