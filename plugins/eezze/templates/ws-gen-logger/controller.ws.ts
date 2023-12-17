import { WsController } from '@eezze/base';
import { ActionDataManager } from '@eezze/classes';
import { SocketController, Channel, Broadcast, On } from '@eezze/decorators';

@SocketController({
	server: 'default-logger',
})
export default class WsGenLoggerController extends WsController {
	@Channel({
		id: 'project-logging-channel',
		channel: (adm: ActionDataManager) => `pr-${adm.input.projectId}`,
		user: (adm: ActionDataManager) => ({
			...adm.request.auth.user,
		}),
	})
	async projectLoggingChannel() {}

	@Broadcast({
		event: 'log',
		channel: (adm: ActionDataManager) => `pr-${adm.input.projectId}`,
	})
	async log() {}
}
