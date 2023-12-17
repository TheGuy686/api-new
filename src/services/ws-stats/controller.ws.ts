import { WsController } from '@eezze/base';
import { ActionDataManager } from '@eezze/classes';
import {
	SocketController,
	OnConnection,
	On,
	Notify,
	Broadcast,
	OnDisconnect,
	Channel,
} from '@eezze/decorators';
import { randDarkColor } from '@eezze/libs/StringMethods';

@SocketController({
	server: 'eezze-ws-stats',
})
export default class WsStatsController extends WsController {
	@Channel({
		id: 'project-channel-subscription',
		channel: (adm: ActionDataManager) => `pr-${adm.input.projectId}`,
		user: (adm: ActionDataManager) => ({
			...adm.request.auth.user,
			avatarColor: randDarkColor(),
		}),
		emitState: true,
	})
	async projectChannel() {}

	@Broadcast({
		event: 'host-mouse-moved',
		channel: (adm: ActionDataManager) => `pr-${adm.input.projectId}`,
	})
	async hostMouseMoved() {}

	@Broadcast({
		event: 'datasources-changed',
		channel: (adm: ActionDataManager) => `pr-${adm.input.projectId}`,
	})
	async datasourcesChanged() {}

	@On({ event: 'editing-entities' })
	async editingProjectEntities() {}

	@On({ event: 'release-entities' })
	async releaseProjectEntities() {}

	@On({ event: 'update-project-state' })
	async updateProjectState() {}

	@OnDisconnect()
	async disconnected() {}
}
