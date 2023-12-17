import { RestController } from '@eezze/base';
import { EController, EGet, EPost, EPut, EDelete } from '@eezze/decorators';

@EController({
	server: 'eezze-project-api',
})
export default class RestProjectsController extends RestController {
	@EGet({ path: '/project/all' }) static async allProjects() {}

	@EGet({ path: '/project/spec' }) static async getProjectOpenApiSpec() {}

	@EPost({ path: '/project' }) static async createProject() {}

	@EPost({ path: '/project/scaffold' }) static async createProjectFromScaffold() {}

	@EGet({ path: '/project/deps-from-tags' }) static async dependenciesFromTags() {}

	@EPost({ path: '/project/tree' }) static async getProjectTreeFromInput() {}

	@EPost({ path: '/project/deploy' }) static async deployProject() {}

	@EPut({ path: '/project' }) static async updateProject() {}

	@EDelete({ path: '/project' }) static async deleteProject() {}

	@EPut({ path: '/project/logo' }) static async uploadProjectLogo() {}

	@EPost({ path: '/project/ask-ai' }) static async askAi() {}

	@EPost({ path: '/project/ask-ai/roles' }) static async askAiRoles() {}

	@EPost({ path: '/project/ask-ai/project' }) static async askAiProject() {}
}