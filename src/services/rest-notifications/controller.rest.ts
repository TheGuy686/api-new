import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestNotificationsController extends RestController {
	@EGet({ path: '/notification/all' }) static async readNotificationAll() {}

	@EPost({ path: '/notification' }) static async createNotification() {}

	@EPut({ path: '/notification' }) static async updateNotification() {}

	@EDelete({ path: '/notification' }) static async deleteNotification() {}

	@EPut({ path: '/notification/all' }) static async markAllAsRead() {}

	@EDelete({ path: '/notification/all' }) static async deleteAllNotifications() {}
}
