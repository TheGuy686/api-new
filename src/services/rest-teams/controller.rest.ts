import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestTeamsController extends RestController {
	@EGet({ path: '/team/all' }) static async allTeams() {}

	@EPost({ path: '/team' }) static async createTeam() {}

	@EDelete({ path: '/team' }) static async deleteTeam() {}
}