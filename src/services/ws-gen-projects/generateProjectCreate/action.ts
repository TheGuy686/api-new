import BaseAction from '@eezze/base/action/BaseAction';
import { LogicChain } from '@eezze/classes';
import ADM from '@eezze/classes/ActionDataManager';
import { Command, Do, EAction, FileSave, GetOne, RenderTemplate, SocketAction } from '@eezze/decorators';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
})
export default class GenerateProjectCreateAction extends BaseAction {
	@GetOne({
		repo: 'Mysql.Project',
		checkOn: [ 'id' ],
		failOnEmpty: true,
		onSuccess: async (adm: ADM, lc: LogicChain) => {
			lc.stash.assign.text('prRoot', `${process.env.PROJECTS_FILE_ROOT}/projects/${ adm.result.id }`);
			lc.stash.assign.number('prId', adm.result.id);
			lc.stash.assign.text('prName', adm.result.projectName);

			await lc.result();
		}
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => `mkdir -m 777 -p ${lc.stash.prop('prRoot')}`,
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `find ${process.env.BOILER_PLATE_ROOT}/ -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitmodules' ! -name 'plugins' ! -name 'migration' -exec cp -R '{}' ${lc.stash.prop('prRoot')} \\;`;
		},
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const repoName = kebabCase(`${lc.stash.prop('prId')}-backend-${lc.stash.prop('prName')}`); // store in project db.
			const githubUsername = 'eezze-projects'; // store in application wide system config.

			return `curl -u ${githubUsername}:${process.env.GITHUB_TOKEN} -X POST -H "Accept: application/vnd.github.v3+json" https://api.github.com/orgs/${githubUsername}/repos -d '{"name":"${repoName}", "private":true}'`
		},
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => `git init ${lc.stash.prop('prRoot')}`,
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			const repoName = kebabCase(`${lc.stash.prop('prId')}-backend-${lc.stash.prop('prName')}`); // store in project db.
			const githubUsername = 'eezze-projects'; // store in application wide system config.

			return `cd ${lc.stash.prop('prRoot')} && git remote add origin https://oauth2:${process.env.GITHUB_TOKEN}@github.com/${githubUsername}/${repoName}.git`;
		},
	})
	@SocketAction({
		urlParams: (adm: ADM) => ({
			token: adm.request.auth.idToken,
		}),
		datasource: 'integration-eezze-ws',
		eventName: 'generate-project-package-json',
		requestBody: (adm: ADM, lc: LogicChain) => ({
			projectId: lc.stash.prop('prId'),
			projectName: lc.stash.prop('prName'),
			description: adm.action(0).result?.description,
			author: adm.action(0).result?.author,
			licence: 'MIT',
		}),
	})
	@RenderTemplate({
		template: 'project-config',
		linter: 'yaml',
		templateVars: (adm: ADM, lc: LogicChain) => ({
			projectId: lc.stash.prop('prId'),
			name: lc.stash.prop('prName'),
			description: adm.action(0).result?.description,
			industry: adm.action(0).result?.industry
		})
	})
	@FileSave({
		datasource: 'FileStorageDefault',
		folder: (adm: ADM, lc: LogicChain) => `projects/${lc.stash.prop('prId')}`,
		fileName: 'project-config.yaml',
		content: (adm: ADM) => adm.result,
	})
	@Command({
		command: (adm: ADM, lc: LogicChain) => {
			return `cd ${lc.stash.prop('prRoot')} && git add . && git commit -m 'init' && git push -u origin master`;
		},
	})
	async _exec() {}
}
