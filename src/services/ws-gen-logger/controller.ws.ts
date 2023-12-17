import { WsController } from '@eezze/base';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import { SocketController, Channel, Broadcast, On } from '@eezze/decorators';

@SocketController({
	server: 'generation-ws-log-server',
})
export default class WsGenLoggerController extends WsController {
	@Channel({
		id: 'project-logging-channel',
		channel: (adm: ADM) => `pr-${adm.input.projectId}`,
	})
	async projectLoggingChannel() {}

	@Broadcast({
		event: 'log',
		channel: (adm: ADM) => `pr-${adm.input.projectId}`,
	})
	async log() {}

	@On({ event: 'exec-unit-tests' })
	async execUnitTest() {}
}
