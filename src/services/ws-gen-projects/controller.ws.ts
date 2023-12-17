import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenProjectsController extends WsController {
	@On({ event: 'generate-project-create' })
	async generateProjectCreate() {}

	@On({ event: 'generate-project-delete' })
	async generateProjectDelete() {}

	@On({ event: 'generate-project-update' })
	async generateProjectUpdate() {}

	@On({ event: 'generate-project-package-json' })
	async generateProjectPackageJson() {}
}