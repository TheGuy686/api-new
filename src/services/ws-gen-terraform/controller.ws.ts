import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenTerraformController extends WsController {
	@On({ event: 'generate-terraform-create' })
	async generateTerraformCreate() {}
}
