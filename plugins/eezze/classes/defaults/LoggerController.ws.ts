import { WsController } from '../../base';
import { SocketController, On } from '../../decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenMigrationsController extends WsController {
	@On({ event: 'log' })
	async generateMigrationSetup() {}
}
