import { WsController } from '@eezze/base';
import { ActionDataManager } from '@eezze/classes';
import {
	SocketController,
	On,
	Notify,
} from '@eezze/decorators';

@SocketController({
	server: 'eezze-ws-stats',
})
export default class WsUserController extends WsController {
	@Notify({
		event: 'user-received-notification',
		connection: (adm: ActionDataManager) => adm.input.userId,
	})
	async userReceivedNotification() {}

	@On({ event: 'user-logged-in' })
	async userLoggedIn() {}
}
