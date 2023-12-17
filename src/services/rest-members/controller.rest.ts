import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestMembersController extends RestController {
	// // here we need to have an endpoint that will retrieve all the emails from any member in a project
	@EGet({ path: '/member/all' }) static async allMembers() {}

	@EPost({ path: '/member' }) static async createMember() {}

	@EPut({ path: '/member' }) static async updateMember() {}

	@EDelete({ path: '/member' }) static async deleteMember() {}

	@EPost({ path: '/member/invite' }) static async inviteMembers() {}

	@EGet({path: '/member/accept-invitation'}) static async acceptInvitation() {}
}