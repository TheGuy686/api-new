import { EAction, Query, GetList } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.Project'
})
export default class AllProjectsAction extends BaseAction {
	@Query({
		// for refrence: If any of the columns ie hasLogger isn't all in successtion
		// then it won't get included into the result set resulting in missing data
		query: () => `
		     SELECT project.id          AS ProjectModel_id,
		            project.userId      AS ProjectModel_userId,
		            project.projectName AS ProjectModel_projectName,
		            project.details     AS ProjectModel_details,
		            project.handle      AS ProjectModel_handle,
		            project.industry    AS ProjectModel_industry,
		            project.logo        AS ProjectModel_logo,
		            (IF(
		                (
		                    SELECT COUNT(ds.id)
		                      FROM datasource AS ds
		                     WHERE ds.projectId = project.id
		                       AND ds.type      = 'eezze-logger'
		                ) > 0,
		                TRUE,
		            	FALSE
		            ))                  AS ProjectModel_hasLogger,
		            team.id             AS TeamModel_id,
		            team.name           AS TeamModel_name,
		            team.description    AS TeamModel_description,
		            team.active         AS TeamModel_active,
		            member.id           AS MemberModel_id,
		            member.accepted     AS MemberModel_accepted,
		            member.active       AS MemberModel_active,
		            user.id             AS UserModel_id,
		            user.firstName      AS UserModel_firstName,
		            user.lastName       AS UserModel_lastName,
		            user.username       AS UserModel_username,
		            user.password       AS UserModel_password,
		            user.email          AS UserModel_email,
		            user.handle         AS UserModel_handle,
		            user.emailVerified  AS UserModel_emailVerified,
		            user.avatar         AS UserModel_avatar,
		            user.active         AS UserModel_active,
		            user.roles          AS UserModel_roles,
		            board.id            AS BoardModel_id,
		            board.board         AS BoardModel_board
		       FROM project     AS project
			LEFT JOIN team       AS team   ON project.id       = team.projectId
			LEFT JOIN board      AS board  ON board.teamId     = team.id
			LEFT JOIN member     AS member ON team.id          = member.teamId
			LEFT JOIN user       AS user   ON member.userId    = user.id
		   LEFT JOIN user       AS uuser  ON member.createdBy = uuser.id
		      WHERE project.userId = ?
		         OR ( 
					        (
		                        SELECT COUNT(im.id)
		                          FROM member AS im
		                         WHERE im.userId = ?
		                           AND team.id = im.teamId
						           AND im.active = 1
		                    ) > 0
						AND team.active = 1
					)
		`,
		input: (adm: ActionDataManager) => [
			adm.request.auth.user.id,
			adm.request.auth.user.id,
		],
	})
	async _exec() {}
}
