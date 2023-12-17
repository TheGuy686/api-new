import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestTaskBoardsController extends RestController {
	@EPost({ path: '/management/task' }) static async createTaskBoard() {}

	@EPut({ path: '/management/task' }) static async updateTaskBoard() {}
}