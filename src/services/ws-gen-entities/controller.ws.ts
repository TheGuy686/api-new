import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenEntitiesController extends WsController {
	@On({ event: 'generate-entity-update' })
	async generateEntityUpdate() {}

	@On({ event: 'generate-all-entities' })
	async generateAllEntities() {}
}
