import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenServConfigsController extends WsController {
	@On({ event: 'generate-serv-config-create-update' })
	async generateServConfigCreateUpdate() {}

	@On({ event: 'generate-serv-config-save-tpl-file' })
	async generateServConfigSaveTplFile() {}

	@On({ event: 'generate-serv-config-delete' })
	async generateServConfigDelete() {}
}
