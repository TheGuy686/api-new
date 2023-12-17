import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenDatasourcesController extends WsController {
	@On({ event: 'generate-datasource-delete' })
	async generateDatasourceDelete() {}

	@On({ event: 'generate-datasource-create-update' })
	async generateDatasourceCreateUpdate() {}
}
