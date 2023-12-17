import { WsController } from '@eezze/base';
import { SocketController, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-server',
})
export default class WsGenMigrationsController extends WsController {
	@On({ event: 'generate-migration-setup' })
	async generateMigrationSetup() { }

	@On({ event: 'generate-migration-create' })
	async generateMigrationCreate() { }

	@On({ event: 'generate-migration-update' })
	async generateMigrationUpdate() { }

	@On({ event: 'generate-migration-files' })
	async generateMigrationFiles() {}

	@On({ event: 'generate-migration-run' })
	async generateMigrationRun() {}
}
